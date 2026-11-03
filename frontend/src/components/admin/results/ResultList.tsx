import { useSearchParams } from "react-router-dom";
import type { MatchSummary } from "../../../types/match";

type resultProps = {
    results:MatchSummary[] | undefined;
    setSearchTeam:(value:string)=>void;
}

function ResultList({results,setSearchTeam}:resultProps){

    const [,setSearchParams] = useSearchParams();
    const resultCount = results?.length ?? 0;

    return(
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">試合結果一覧</h1>
                <span className="text-base text-gray-500">{`全${resultCount}件`}</span>
            </div>

            <div className="my-1">
                <label className="sr-only" htmlFor="search">対戦チーム名検索バー</label>
                <input
                    className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700"
                    id="search"
                    type="text"
                    placeholder="対戦チーム名を入力して下さい"
                    onChange={(e)=>setSearchTeam(e.target.value)}
                />
            </div>

            <div className="overflow-y-auto max-h-160 my-1">
                <table className="w-full border-collapse text-base">
                    <thead>
                        <tr>
                            <td className="text-center">日付</td>
                            <td className="text-left">対戦カード</td>
                            <td className="text-center">スコア</td>
                        </tr>
                    </thead>
                    <tbody>
                    {results?.map((result)=>{
                        const myTeam = result.teams.find((team)=>team.team_name === "アスレチックス");
                        const opponentTeam = result.teams.find((team)=>team.team_name !== "アスレチックス");
                        const myTeamScore = myTeam?.final_score;
                        const opponentTeamScore = opponentTeam?.final_score;

                        return(
                            <tr 
                                key={result.id} 
                                className="border-b border-gray-200 hover:bg-blue-200 cursor-pointer"
                                onClick={()=>setSearchParams({result_id:String(result.id)})}
                            >
                                
                                <th className="w-20 px-3 py-3 text-center font-medium text-gray-500">
                                    {result.match_date.replaceAll("-", "/")}
                                </th>
                                <td className="px-3 py-3 text-left font-medium text-slate-900">
                                    {`VS${opponentTeam?.team_name}`}
                                </td>
                                <td className="w-20 px-3 py-3 text-center text-slate-900">
                                    {`${myTeamScore}-${opponentTeamScore}`}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default ResultList;