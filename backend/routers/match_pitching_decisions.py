from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.match import Match
from models.match_battery import MatchBattery
from models.match_pitching_decision import MatchPitchingDecision
from models.player import Player
from schemas.match_pitching_decision import (
    MatchPitchingDecisionResponse,
    MatchPitchingDecisionUpdate,
)


router = APIRouter(
    prefix="/matches/{match_id}/pitching-decisions",
    tags=["match-pitching-decisions"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def to_response(
    decision: MatchPitchingDecision,
) -> MatchPitchingDecisionResponse:
    return MatchPitchingDecisionResponse(
        id=decision.id,
        match_id=decision.match_id,
        player_id=decision.player_id,
        player_name=decision.player.name,
        uniform_number=decision.player.uniform_number,
        decision=decision.decision,
    )


@router.get(
    "",
    response_model=list[MatchPitchingDecisionResponse],
)
def get_pitching_decisions(
    match_id: int,
    db: Session = Depends(get_db),
):
    # --------------------------------
    # 試合存在チェック
    # --------------------------------
    match = (
        db.query(Match)
        .filter(Match.id == match_id)
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=404,
            detail="試合が見つかりません",
        )

    # --------------------------------
    # 勝敗投手・セーブ取得
    # --------------------------------
    decisions = (
        db.query(MatchPitchingDecision)
        .filter(
            MatchPitchingDecision.match_id == match_id
        )
        .order_by(
            MatchPitchingDecision.id
        )
        .all()
    )

    return [
        to_response(decision)
        for decision in decisions
    ]


@router.put(
    "",
    response_model=list[MatchPitchingDecisionResponse],
)
def update_pitching_decisions(
    match_id: int,
    data: MatchPitchingDecisionUpdate,
    db: Session = Depends(get_db),
):
    # --------------------------------
    # 試合存在チェック
    # --------------------------------
    match = (
        db.query(Match)
        .filter(Match.id == match_id)
        .first()
    )

    if not match:
        raise HTTPException(
            status_code=404,
            detail="試合が見つかりません",
        )

    # --------------------------------
    # 同一選手の重複チェック
    # --------------------------------
    player_ids = [
        item.player_id
        for item in data.decisions
    ]

    if len(player_ids) != len(set(player_ids)):
        raise HTTPException(
            status_code=400,
            detail="同じ選手を複数の勝敗投手・セーブに登録できません",
        )

    # --------------------------------
    # decisionごとの重複チェック
    # --------------------------------
    decisions = [
        item.decision
        for item in data.decisions
    ]

    for decision_type in {
        "WIN",
        "LOSS",
        "SAVE",
    }:
        if decisions.count(decision_type) > 1:
            raise HTTPException(
                status_code=400,
                detail=f"{decision_type}は1試合につき1人まで登録できます",
            )

    # --------------------------------
    # 入力データを事前検証
    # --------------------------------
    validated_items = []

    for item in data.decisions:
        # -----------------------------
        # 選手存在チェック
        # -----------------------------
        player = (
            db.query(Player)
            .filter(
                Player.id == item.player_id
            )
            .first()
        )

        if not player:
            raise HTTPException(
                status_code=404,
                detail=f"選手ID {item.player_id} が見つかりません",
            )

        # -----------------------------
        # 登板実績チェック
        # -----------------------------
        pitched = (
            db.query(MatchBattery)
            .join(
                MatchBattery.match_team
            )
            .filter(
                MatchBattery.pitcher_id == item.player_id,
                MatchBattery.match_team.has(
                    match_id=match_id
                ),
            )
            .first()
        )

        if not pitched:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"選手ID {item.player_id} は"
                    "この試合で登板していません"
                ),
            )

        validated_items.append(
            (
                item,
                player,
            )
        )

    # --------------------------------
    # 全入力の検証完了後に既存データを削除
    # --------------------------------
    (
        db.query(MatchPitchingDecision)
        .filter(
            MatchPitchingDecision.match_id == match_id
        )
        .delete(
            synchronize_session=False
        )
    )

    # --------------------------------
    # 新しいデータを登録
    # --------------------------------
    for item, player in validated_items:
        decision = MatchPitchingDecision(
            match_id=match_id,
            player_id=player.id,
            decision=item.decision,
        )

        db.add(decision)

    db.commit()

    # --------------------------------
    # 登録結果取得
    # --------------------------------
    saved_decisions = (
        db.query(MatchPitchingDecision)
        .filter(
            MatchPitchingDecision.match_id == match_id
        )
        .order_by(
            MatchPitchingDecision.id
        )
        .all()
    )

    return [
        to_response(decision)
        for decision in saved_decisions
    ]