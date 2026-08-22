from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from models.match import Match
from models.match_team import MatchTeam
from models.team import Team
from schemas.match_team import (
    MatchTeamResponse,
    MatchTeamsUpdate,
)


router = APIRouter(
    prefix="/matches/{match_id}/teams",
    tags=["match-teams"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=list[MatchTeamResponse])
def get_match_teams(
    match_id: int,
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

    results = (
        db.query(MatchTeam, Team)
        .join(
            Team,
            Team.id == MatchTeam.team_id,
        )
        .filter(MatchTeam.match_id == match_id)
        .order_by(MatchTeam.is_home.desc())
        .all()
    )

    return [
        MatchTeamResponse(
            id=match_team.id,
            team_id=match_team.team_id,
            team_name=team.name,
            is_home=match_team.is_home,
            final_score=match_team.final_score,
        )
        for match_team, team in results
    ]


@router.put("", response_model=list[MatchTeamResponse])
def update_match_teams(
    match_id: int,
    data: MatchTeamsUpdate,
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

    if len(data.teams) != 2:
        raise HTTPException(
            status_code=400,
            detail="試合には2チームを指定してください",
        )

    team_ids = [team.team_id for team in data.teams]

    if len(set(team_ids)) != 2:
        raise HTTPException(
            status_code=400,
            detail="同じチームを重複して指定することはできません",
        )

    home_count = sum(
        team.is_home
        for team in data.teams
    )

    if home_count != 1:
        raise HTTPException(
            status_code=400,
            detail="ホームチームは1チームだけ指定してください",
        )

    teams = (
        db.query(Team)
        .filter(Team.id.in_(team_ids))
        .all()
    )

    if len(teams) != 2:
        raise HTTPException(
            status_code=400,
            detail="存在しないチームが指定されています",
        )

    team_map = {
        team.id: team
        for team in teams
    }

    db.query(MatchTeam).filter(
        MatchTeam.match_id == match_id
    ).delete(synchronize_session=False)

    for team_data in data.teams:
        db.add(
            MatchTeam(
                match_id=match_id,
                team_id=team_data.team_id,
                is_home=team_data.is_home,
                final_score=team_data.final_score,
            )
        )

    db.commit()

    results = (
        db.query(MatchTeam, Team)
        .join(
            Team,
            Team.id == MatchTeam.team_id,
        )
        .filter(MatchTeam.match_id == match_id)
        .order_by(MatchTeam.is_home.desc())
        .all()
    )

    return [
        MatchTeamResponse(
            id=match_team.id,
            team_id=match_team.team_id,
            team_name=team.name,
            is_home=match_team.is_home,
            final_score=match_team.final_score,
        )
        for match_team, team in results
    ]