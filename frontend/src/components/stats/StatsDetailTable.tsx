import { Link } from "react-router-dom";
import type { Season } from "../../types/match";
import type { SeasonBattingStat } from "../../types/stats";
import { useState } from "react";

type StatsDetailProps = {
    seasons:Season[] | undefined;
    seasonIsLoading:boolean;
    stats:SeasonBattingStat[] | undefined;
    statsIsLoading:boolean;
    selectedSeasonId:number | undefined;
    onChangeSeasonId: (id: number) => void;
}

function StatsDetailTable({seasons,seasonIsLoading,stats,statsIsLoading,selectedSeasonId,onChangeSeasonId}:StatsDetailProps){

    if(seasonIsLoading){
        return <p>読み込み中...</p>
    }

    const sortOptions:{value : keyof SeasonBattingStat;label : string}[] = [
        { value: "games", label: "試合" },
        { value: "batting_average", label: "打率" },
        { value: "at_bats", label: "打数" },
        { value: "hits", label: "安打" },
        { value: "doubles", label: "二塁打" },
        { value: "triples", label: "三塁打" },
        { value: "home_runs", label: "本塁打" },
        { value: "runs_batted_in", label: "打点" },
        { value: "strikeouts", label: "三振" },
        { value: "walks", label: "四球" },
        { value: "hit_by_pitch", label: "死球" },
        { value: "sacrifice_bunts", label: "犠打" },
        { value: "sacrifice_flies", label: "犠飛" },
        { value: "stolen_bases", label: "盗塁" },
        { value: "on_base_percentage", label: "出塁率" },
        { value: "slugging_percentage", label: "長打率" },
        { value: "ops", label: "OPS" },
    ]

    const [sortKey,setSortKey] = useState<keyof SeasonBattingStat>("games");

    const plateAppearances = (stat: SeasonBattingStat) =>
        stat.at_bats + stat.walks + stat.hit_by_pitch + stat.sacrifice_bunts + stat.sacrifice_flies;

    const isQualified = (stat: SeasonBattingStat)=>
        plateAppearances(stat) >= stat.games * 2;

    const RATE_STAT_KEYS: (keyof SeasonBattingStat)[] = [
        "batting_average",
        "on_base_percentage",
        "slugging_percentage",
        "ops",
    ];

    const sortedStats =
        stats ? [...stats].sort((a, b) => {
            if (RATE_STAT_KEYS.includes(sortKey)) {
                const aQualified = isQualified(a);
                const bQualified = isQualified(b);
                if (aQualified !== bQualified) {
                    return aQualified ? -1 : 1;
                }
            }
            return Number(b[sortKey]) - Number(a[sortKey]);
        })
        : undefined;

    const highlightClass = (key: keyof SeasonBattingStat) =>
        sortKey === key ? "bg-gray-100 font-bold" : "";

    return(
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-6 px-6">
            {/*ぱんくずリスト*/}
            <div className="flex items-center gap-3 text-base text-gray-500">
                <Link to="/" className="hover:underline">TOP</Link>
                <span>&gt;</span>
                <Link to="/stats" className="hover:underline">個人成績</Link>
                <span>&gt;</span>
                <span className="text-slate-900 font-medium">打撃成績一覧</span>
            </div>

            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">打撃成績一覧</h1>
                </div>
                <select
                    aria-label="シーズン"
                    className="px-4 py-2 text-base text-slate-900 bg-white border border-gray-300 rounded-lg"
                    value={selectedSeasonId ?? ""}
                    onChange={(e)=>onChangeSeasonId(Number(e.target.value))}
                >
                    {seasons?.map((season)=>(
                        <option key={season.id} value={season.id}>
                            {season.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-3 text-base text-gray-500">
                <label htmlFor="sort">並び替え</label>
                <select
                    id="sort"
                    className="px-3 py-2 text-base text-slate-900 bg-white border border-gray-300 rounded-lg"
                    value={sortKey}
                    onChange={(e)=>setSortKey(e.target.value as keyof SeasonBattingStat)}
                >
                    {sortOptions.map((sortOption)=>(
                        <option key={sortOption.value} value={sortOption.value}>
                            {sortOption.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto border border-gray-200 shadow-sm bg-white">
                <table className="w-full min-w-[1400px] border-collapse text-center text-sm text-slate-900 tabular-nums">
                    <thead className="bg-gray-50 border-b border-gray-200 text-base font-medium text-gray-500">
                        <tr>
                            <th className="px-3 py-3 whitespace-nowrap">順位</th>
                            <th className="px-3 py-3 text-left whitespace-nowrap">選手名</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("games")}`}>試合</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("batting_average")}`}>打率</th>
                            <th className="px-3 py-3 whitespace-nowrap">打席</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("at_bats")}`}>打数</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("hits")}`}>安打</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("doubles")}`}>二塁打</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("triples")}`}>三塁打</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("home_runs")}`}>本塁打</th>
                            <th className="px-3 py-3 whitespace-nowrap">塁打</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("runs_batted_in")}`}>打点</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("strikeouts")}`}>三振</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("walks")}`}>四球</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("hit_by_pitch")}`}>死球</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("sacrifice_bunts")}`}>犠打</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("sacrifice_flies")}`}>犠飛</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("stolen_bases")}`}>盗塁</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("on_base_percentage")}`}>出塁率</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("slugging_percentage")}`}>長打率</th>
                            <th className={`px-3 py-3 whitespace-nowrap ${highlightClass("ops")}`}>OPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statsIsLoading ? (
                            <tr>
                                <td colSpan={21} className="px-3 py-6 text-center text-gray-400">読み込み中...</td>
                            </tr>
                        ) : (
                            sortedStats?.map((stat,index)=>(
                                <tr key={stat.player_id}
                                    className="border-b border-gray-100 text-slate-900 text-base hover:bg-gray-50">
                                    <td className="px-3 py-3 font-medium">{index + 1}</td>
                                    <td className="px-3 py-3 text-left">
                                        <Link to="#" className="hover:underline">{stat.player_name}</Link>
                                    </td>
                                    <td className={`px-3 py-3 ${highlightClass("games")}`}>{stat.games}</td>
                                    <td className={`px-3 py-3 ${highlightClass("batting_average")}`}>{stat.batting_average.toFixed(3).replace(/^0/, "")}</td>
                                    <td className="px-3 py-3">
                                        {plateAppearances(stat)}
                                    </td>
                                    <td className={`px-3 py-3 ${highlightClass("at_bats")}`}>{stat.at_bats}</td>
                                    <td className={`px-3 py-3 ${highlightClass("hits")}`}>{stat.hits}</td>
                                    <td className={`px-3 py-3 ${highlightClass("doubles")}`}>{stat.doubles}</td>
                                    <td className={`px-3 py-3 ${highlightClass("triples")}`}>{stat.triples}</td>
                                    <td className={`px-3 py-3 ${highlightClass("home_runs")}`}>{stat.home_runs}</td>
                                    <td className="px-3 py-3">
                                        {stat.hits + stat.doubles + (stat.triples * 2) + (stat.home_runs * 3)}
                                    </td>
                                    <td className={`px-3 py-3 ${highlightClass("runs_batted_in")}`}>{stat.runs_batted_in}</td>
                                    <td className={`px-3 py-3 ${highlightClass("strikeouts")}`}>{stat.strikeouts}</td>
                                    <td className={`px-3 py-3 ${highlightClass("walks")}`}>{stat.walks}</td>
                                    <td className={`px-3 py-3 ${highlightClass("hit_by_pitch")}`}>{stat.hit_by_pitch}</td>
                                    <td className={`px-3 py-3 ${highlightClass("sacrifice_bunts")}`}>{stat.sacrifice_bunts}</td>
                                    <td className={`px-3 py-3 ${highlightClass("sacrifice_flies")}`}>{stat.sacrifice_flies}</td>
                                    <td className={`px-3 py-3 ${highlightClass("stolen_bases")}`}>{stat.stolen_bases}</td>
                                    <td className={`px-3 py-3 ${highlightClass("on_base_percentage")}`}>{stat.on_base_percentage.toFixed(3).replace(/^0/, "")}</td>
                                    <td className={`px-3 py-3 ${highlightClass("slugging_percentage")}`}>{stat.slugging_percentage.toFixed(3).replace(/^0/, "")}</td>
                                    <td className={`px-3 py-3 ${highlightClass("ops")}`}>{stat.ops.toFixed(3).replace(/^0/, "")}</td>
                                </tr>            
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default StatsDetailTable;
