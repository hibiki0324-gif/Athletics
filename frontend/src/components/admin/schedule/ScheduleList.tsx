import type { MatchSummary } from "../../../types/match";
import { useSearchParams } from "react-router-dom";

type ScheduleListProps = {
    matches:MatchSummary[] | undefined;
    selectedYear:string,
    setSelectedYear:(value:string)=>void,
    availableYears:string[]
}

function ScheduleList({matches,selectedYear,setSelectedYear,availableYears}:ScheduleListProps){

    //クエリパラメータ
    const [searchParams,setSearchParams] = useSearchParams();
    const selectedId = searchParams.get("match_id");
    //試合件数カウント
    const matchCount = matches?.length ?? 0;

    return(
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">試合日程一覧</h1>
                <span className="text-base text-gray-500">{`全${matchCount}件`}</span>
            </div>

            <div className="my-1">
                <label htmlFor="scheduleYear" className="sr-only">表示する年</label>
                <select
                    className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700"
                    id="scheduleYear"
                    value={selectedYear}
                    onChange={(e)=>setSelectedYear(e.target.value)}
                >
                    {availableYears.map((year)=>(
                        <option key={year} value={year}>{year}年</option>
                    ))}
                </select>
            </div>

            <div className="overflow-y-auto max-h-100 my-1">
                <table className="w-full border-collapse text-base">
                    <thead>
                        <tr>
                            <td className="text-left">日付</td>
                            <td className="text-left">対戦カード</td>
                            <td className="text-left">球場</td>
                        </tr>
                    </thead>
                    <tbody>
                        {matches?.map((match)=>{
                            const homeTeam = match.teams.find((team)=>team.is_home);
                            const awayTeam = match.teams.find((team)=>!team.is_home);

                            return(
                                <tr key={match.id}
                                    className={`cursor-pointer border-b border-gray-200 hover:bg-blue-200 ${
                                        selectedId === String(match.id) ? "bg-blue-100" : ""
                                    }`}
                                    onClick={()=>setSearchParams({match_id:String(match.id)})}
                                    >
                                    <th className="w-28 px-3 py-3 text-left font-medium text-gray-500">
                                        {match.match_date}
                                    </th>
                                    <td className="px-3 py-3 text-left font-medium text-slate-900">
                                        {`${homeTeam?.team_name ?? "未定"} vs ${awayTeam?.team_name ?? "未定"}`}
                                    </td>
                                    <td className="px-3 py-3 text-left text-slate-900">
                                        {match.venue ?? "未定"}
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

export default ScheduleList;
