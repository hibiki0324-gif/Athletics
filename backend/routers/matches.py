from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from models.match import Match
from models.season import Season
from models.match_team import MatchTeam
from models.match_inning import MatchInning
from models.match_lineup_entry import MatchLineupEntry
from models.match_batting_stat import MatchBattingStat
from models.match_battery import MatchBattery
from models.match_pitching_decision import MatchPitchingDecision

from models.team import Team
from models.player import Player
from models.position import Position

from schemas.match import (
    MatchCreate,
    MatchUpdate,
    MatchResponse,
    MatchDetailResponse,
)


router = APIRouter(
    prefix="/matches",
    tags=["matches"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get(
    "",
    response_model=list[MatchResponse],
)
def get_matches(
    db: Session = Depends(get_db),
):
    return (
        db.query(Match)
        .order_by(
            Match.match_date.desc(),
            Match.id.desc(),
        )
        .all()
    )


@router.get(
    "/{match_id}",
    response_model=MatchDetailResponse,
)
def get_match(
    match_id: int,
    db: Session = Depends(get_db),
):
    # --------------------------------
    # 試合
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
    # シーズン
    # --------------------------------
    season = (
        db.query(Season)
        .filter(Season.id == match.season_id)
        .first()
    )

    # --------------------------------
    # 試合チーム
    # --------------------------------
    match_teams = (
        db.query(
            MatchTeam,
            Team.name,
        )
        .join(
            Team,
            MatchTeam.team_id == Team.id,
        )
        .filter(
            MatchTeam.match_id == match_id
        )
        .order_by(
            MatchTeam.is_home.desc()
        )
        .all()
    )

    teams = [
        {
            "id": match_team.id,
            "team_id": match_team.team_id,
            "team_name": team_name,
            "is_home": match_team.is_home,
            "final_score": match_team.final_score,
        }
        for match_team, team_name in match_teams
    ]

    # --------------------------------
    # イニング
    # --------------------------------
    innings = []

    for match_team, team_name in match_teams:
        team_innings = (
            db.query(MatchInning)
            .filter(
                MatchInning.match_team_id == match_team.id
            )
            .order_by(
                MatchInning.inning_number
            )
            .all()
        )

        innings.append(
            {
                "match_team_id": match_team.id,
                "team_id": match_team.team_id,
                "team_name": team_name,
                "is_home": match_team.is_home,
                "innings": [
                    {
                        "inning_number": inning.inning_number,
                        "runs": inning.runs,
                    }
                    for inning in team_innings
                ],
            }
        )

    # --------------------------------
    # 出場履歴
    # --------------------------------
    lineup = []

    lineup_entries = (
        db.query(
            MatchLineupEntry,
            Player.name,
            Player.uniform_number,
            Position.name,
        )
        .join(
            Player,
            MatchLineupEntry.player_id == Player.id,
        )
        .join(
            Position,
            MatchLineupEntry.position_id == Position.id,
        )
        .join(
            MatchTeam,
            MatchLineupEntry.match_team_id == MatchTeam.id,
        )
        .filter(
            MatchTeam.match_id == match_id
        )
        .order_by(
            MatchLineupEntry.match_team_id,
            MatchLineupEntry.entry_sequence,
        )
        .all()
    )

    for entry, player_name, uniform_number, position_name in lineup_entries:
        lineup.append(
            {
                "id": entry.id,
                "match_team_id": entry.match_team_id,
                "player_id": entry.player_id,
                "player_name": player_name,
                "uniform_number": uniform_number,
                "position_id": entry.position_id,
                "position_name": position_name,
                "batting_order": entry.batting_order,
                "entry_sequence": entry.entry_sequence,
                "entry_inning": entry.entry_inning,
                "exit_inning": entry.exit_inning,
                "is_starter": entry.is_starter,
            }
        )

    # --------------------------------
    # 打撃成績
    # --------------------------------
    batting_stats = []

    batting_entries = (
        db.query(
            MatchBattingStat,
            Player.name,
            Player.uniform_number,
        )
        .join(
            Player,
            MatchBattingStat.player_id == Player.id,
        )
        .join(
            MatchTeam,
            MatchBattingStat.match_team_id == MatchTeam.id,
        )
        .filter(
            MatchTeam.match_id == match_id
        )
        .order_by(
            MatchBattingStat.match_team_id,
            Player.uniform_number,
        )
        .all()
    )

    for stat, player_name, uniform_number in batting_entries:
        batting_stats.append(
            {
                "id": stat.id,
                "match_team_id": stat.match_team_id,
                "player_id": stat.player_id,
                "player_name": player_name,
                "uniform_number": uniform_number,
                "at_bats": stat.at_bats,
                "hits": stat.hits,
                "doubles": stat.doubles,
                "triples": stat.triples,
                "home_runs": stat.home_runs,
                "runs_batted_in": stat.runs_batted_in,
                "walks": stat.walks,
                "hit_by_pitch": stat.hit_by_pitch,
                "sacrifice_bunts": stat.sacrifice_bunts,
                "sacrifice_flies": stat.sacrifice_flies,
                "strikeouts": stat.strikeouts,
                "stolen_bases": stat.stolen_bases,
            }
        )

    # --------------------------------
    # バッテリー
    # --------------------------------
    batteries = []

    battery_entries = (
        db.query(MatchBattery)
        .filter(
            MatchBattery.match_team_id.in_(
                [
                    match_team.id
                    for match_team, _ in match_teams
                ]
            )
        )
        .order_by(
            MatchBattery.match_team_id,
            MatchBattery.sequence_no,
        )
        .all()
    )

    for battery in battery_entries:
        pitcher = (
            db.query(Player)
            .filter(Player.id == battery.pitcher_id)
            .first()
        )

        catcher = (
            db.query(Player)
            .filter(Player.id == battery.catcher_id)
            .first()
        )

        batteries.append(
            {
                "id": battery.id,
                "match_team_id": battery.match_team_id,
                "pitcher_id": battery.pitcher_id,
                "pitcher_name": pitcher.name,
                "pitcher_uniform_number": pitcher.uniform_number,
                "catcher_id": battery.catcher_id,
                "catcher_name": catcher.name,
                "catcher_uniform_number": catcher.uniform_number,
                "sequence_no": battery.sequence_no,
                "entry_inning": battery.entry_inning,
                "exit_inning": battery.exit_inning,
            }
        )

    # --------------------------------
    # 勝敗投手・セーブ
    # --------------------------------
    pitching_decisions = []

    decision_entries = (
        db.query(
            MatchPitchingDecision,
            Player.name,
            Player.uniform_number,
        )
        .join(
            Player,
            MatchPitchingDecision.player_id == Player.id,
        )
        .filter(
            MatchPitchingDecision.match_id == match_id
        )
        .order_by(
            MatchPitchingDecision.id
        )
        .all()
    )

    for decision, player_name, uniform_number in decision_entries:
        pitching_decisions.append(
            {
                "id": decision.id,
                "match_id": decision.match_id,
                "player_id": decision.player_id,
                "player_name": player_name,
                "uniform_number": uniform_number,
                "decision": decision.decision,
            }
        )

    # --------------------------------
    # 詳細レスポンス
    # --------------------------------
    return {
        "id": match.id,
        "season": {
            "id": season.id,
            "year": season.year,
            "name": season.name,
        }
        if season
        else None,
        "match_date": match.match_date,
        "start_time": match.start_time,
        "venue": match.venue,
        "teams": teams,
        "innings": innings,
        "lineup": lineup,
        "batting_stats": batting_stats,
        "batteries": batteries,
        "pitching_decisions": pitching_decisions,
    }


@router.post(
    "",
    response_model=MatchResponse,
    status_code=201,
)
def create_match(
    match_data: MatchCreate,
    db: Session = Depends(get_db),
):
    season = (
        db.query(Season)
        .filter(Season.id == match_data.season_id)
        .first()
    )

    if not season:
        raise HTTPException(
            status_code=400,
            detail="指定されたシーズンが存在しません",
        )

    match = Match(
        season_id=match_data.season_id,
        match_date=match_data.match_date,
        start_time=match_data.start_time,
        venue=match_data.venue,
    )

    db.add(match)
    db.commit()
    db.refresh(match)

    return match


@router.put(
    "/{match_id}",
    response_model=MatchResponse,
)
def update_match(
    match_id: int,
    match_data: MatchUpdate,
    db: Session = Depends(get_db),
):
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

    season = (
        db.query(Season)
        .filter(Season.id == match_data.season_id)
        .first()
    )

    if not season:
        raise HTTPException(
            status_code=400,
            detail="指定されたシーズンが存在しません",
        )

    match.season_id = match_data.season_id
    match.match_date = match_data.match_date
    match.start_time = match_data.start_time
    match.venue = match_data.venue

    db.commit()
    db.refresh(match)

    return match