import { Link } from "react-router-dom";
import type { MatchSummary } from "../../types/match";

type ResultCardProps = {
    result:MatchSummary[] | undefined,
    isLoading:boolean,
}

function ResultCard({result,isLoading}:ResultCardProps){

    if (isLoading) {
        return <p className="text-center font-bold text-2xl">読み込み中...</p>;
    }

    if (!result) {
        return <p className="text-center font-bold text-2xl">試合情報が取得できませんでした。</p>;
    }

    return(
        <>
            {result.map((match) => {
                const myTeam = match.teams.find((team) => team.team_name === "アスレチックス");
                const opponentTeam = match.teams.find((team) => team.team_name !== "アスレチックス");
                let resultLabel = "LOSE"
                if(myTeam && opponentTeam){
                    if(myTeam.final_score > opponentTeam.final_score){
                        resultLabel = "WIN";
                    } else if(myTeam.final_score == opponentTeam.final_score){
                        resultLabel = "DRAW";
                    }
                }

                return(
                    <div key={match.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_8rem] items-center w-full max-w-5xl mx-auto py-9 pl-6 border border-gray-200 rounded-xl shadow-sm bg-white transition-shadow hover:shadow-md">
                        <div className="text-base text-gray-500 font-medium border-r border-gray-200 pr-6">
                            <p>{match.match_date}</p>
                            <p>{match.venue}</p>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 border-r border-gray-200 px-6">
                            <div className="flex items-center justify-end gap-4">
                                <p className="text-base text-gray-700 font-medium">{myTeam?.team_name}</p>
                                <p className="text-4xl font-bold text-slate-900">{myTeam?.final_score}</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-300">-</p>
                            <div className="flex items-center justify-start gap-4">
                                <p className="text-4xl font-bold text-slate-900">{opponentTeam?.final_score}</p>
                                <p className="text-base text-gray-700 font-medium">{opponentTeam?.team_name}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <span className="w-20 text-center py-3 text-sm font-bold text-white bg-amber-500 rounded">
                                {resultLabel}
                            </span>
                            <Link to={`/results/${match.id}`} className="px-4 py-2 text-sm border border-gray-300 rounded-full transition-colors hover:bg-gray-50">
                                試合詳細
                            </Link>
                        </div>
                    </div>
                );
            })}
        </>
    )
};

export default ResultCard;