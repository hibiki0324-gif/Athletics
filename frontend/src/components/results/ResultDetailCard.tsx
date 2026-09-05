import { Link } from "react-router-dom";
import type { MatchDetail } from "../../types/match";

type ResultDetailCardProps = {
    result?: MatchDetail;
    isLoading: boolean;
}
function ResultDetailCard({result,isLoading}:ResultDetailCardProps){

    if (isLoading) {
        return <p className="text-center font-bold text-2xl">読み込み中...</p>;
    }

    if (!result) {
        return <p>試合情報が見つかりませんでした。</p>;
    }

    const homeTeam = result?.teams.find((team)=>team.is_home);
    const awayTeam = result?.teams.find((team)=>!team.is_home);
    const homeScore = result?.innings.find((home)=>home.is_home);
    const awayScore = result?.innings.find((away)=>!away.is_home);
    const winPitcher = result?.pitching_decisions.find((win)=>win.decision === "WIN");
    const lossPitcher = result?.pitching_decisions.find((loss)=>loss.decision === "LOSS");
    const savePitcher = result?.pitching_decisions.find((save)=>save.decision === "SAVE");
    const homeBattery = result?.batteries.find((home)=>home.match_team_id === homeTeam?.id);
    const awayBattery = result?.batteries.find((away)=>away.match_team_id === awayTeam?.id);
    const homeLineup = result?.lineup.filter((entry)=>entry.match_team_id === homeTeam?.id);

    //打撃チーム成績計算系
    const homeBattingStats = result?.batting_stats.filter((s)=>s.match_team_id === homeTeam?.id);
    //各項目合計値計算
    const homeTotal = homeBattingStats?.reduce(
        (acc, s) => ({
            at_bats: acc.at_bats + s.at_bats,
            hits: acc.hits + s.hits,
            home_runs: acc.home_runs + s.home_runs,
            runs_batted_in: acc.runs_batted_in + s.runs_batted_in,
            doubles: acc.doubles + s.doubles,
            triples: acc.triples + s.triples,
            walks: acc.walks + s.walks,
            sacrifice_flies: acc.sacrifice_flies + s.sacrifice_flies,
            strikeouts: acc.strikeouts + s.strikeouts,
        }),
        { at_bats: 0, hits: 0, home_runs: 0, runs_batted_in: 0, doubles: 0, triples: 0, walks: 0, sacrifice_flies: 0, strikeouts: 0 }
    );
    //チーム打率計算
    const homeTotalAverage =
        homeTotal && homeTotal.at_bats > 0 ? (homeTotal.hits / homeTotal.at_bats).toFixed(3).replace(/^0/, "") : "-";

    return(
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-6 px-6">
            {/*ぱんくずリスト*/}
            <div className="flex items-center gap-3 text-base text-gray-500">
                <Link to="/" className="hover:underline">TOP</Link>
                <span>&gt;</span>
                <Link to="/results" className="hover:underline">試合結果</Link>
                <span>&gt;</span>
                <span className="text-slate-900 font-medium">試合結果詳細</span>
            </div>
            {/*試合結果カード*/}
            <div className="bg-white border border-gray-300 shadow-sm py-2 px-6">
                <span className="inline-block px-3 py-1 text-base font-medium text-slate-900 border border-gray-300 rounded-full">
                    {result?.season.name}
                </span>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                    {result?.match_date}
                    <span className="ml-3 text-base font-medium text-gray-600">(日)</span>{/* ここカラムは必要？ */}
                    <span className="ml-3 text-base font-medium text-gray-600">{result?.start_time}試合開始</span>
                </p>
                <p className="mt-1 text-base text-gray-500">{result?.venue}</p>
                <div className="flex items-center justify-center gap-10 mt-6 pt-6 pb-10">
                    <div className="text-center">
                        <p className="text-xl font-bold text-slate-900">{awayTeam?.team_name}</p>
                        <p className="mt-2 text-5xl font-bold text-blue-900">{awayTeam?.final_score}</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-300">-</p>
                    <div className="text-center">
                        <p className="text-xl font-bold text-slate-900">{homeTeam?.team_name}</p>
                        <p className="mt-2 text-5xl font-bold text-slate-900">{homeTeam?.final_score}</p>
                    </div>
                </div>
            </div>

            {/*スコアボード*/}
            <div className="overflow-x-auto border border-gray-200 shadow-sm bg-white">
                <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-base font-medium text-gray-500">
                            <th className="px-4 py-3 text-left">TEAM</th>
                            <th className="px-4 py-3 text-center">1</th>
                            <th className="px-4 py-3 text-center">2</th>
                            <th className="px-4 py-3 text-center">3</th>
                            <th className="px-4 py-3 text-center">4</th>
                            <th className="px-4 py-3 text-center">5</th>
                            <th className="px-4 py-3 text-center">6</th>
                            <th className="px-4 py-3 text-center">7</th>
                            <th className="px-4 py-3 text-center text-lg">R</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 text-base text-slate-900">
                            <td className="px-4 py-3 font-bold ">{awayTeam?.team_name}</td>
                                {awayScore?.innings.map((away)=>(
                                    <td className="px-4 py-3 text-center"
                                        key={away.inning_number}>
                                        {away.runs}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-center text-lg">
                                    {awayTeam?.final_score}
                                </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-bold ">{homeTeam?.team_name}</td>
                                {homeScore?.innings.map((home)=>(
                                    <td key={home.inning_number}
                                        className="px-4 py-3 text-center">
                                        {home.runs}
                                    </td>
                            ))}
                            <td className="px-4 py-3 text-center text-lg">
                                {homeTeam?.final_score}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 責任投手カード */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="border border-gray-200 shadow-sm bg-white px-6 py-5">
                    <p className="mb-3 text-lg font-bold text-slate-900">責任投手</p>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">勝利投手</th>
                                <td className="py-2 text-sm text-slate-900">{winPitcher?.player_name}</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">敗戦投手</th>
                                <td className="py-2 text-sm text-slate-900">{lossPitcher?.player_name}</td>
                            </tr>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">セーブ</th>
                                <td className="py-2 text-sm text-slate-900">{savePitcher?.player_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 本塁打カード */}
                <div className="border border-gray-200 shadow-sm bg-white px-6 py-5">
                    <p className="mb-3 text-lg font-bold text-slate-900">本塁打</p>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">{homeTeam?.team_name}</th>
                                <td className="py-2 text-sm text-slate-900"></td>
                            </tr>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">{awayTeam?.team_name}</th>
                                <td className="py-2 text-sm text-slate-900"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* バッテリーカード */}
                <div className="border border-gray-200 shadow-sm bg-white px-6 py-5">
                    <p className="mb-3 text-lg font-bold text-slate-900">バッテリー</p>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">{homeTeam?.team_name}</th>
                                <td className="py-2 text-sm text-slate-900">
                                    {homeBattery?.pitcher_name}-{homeBattery?.catcher_name}
                                </td>
                            </tr>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">{awayTeam?.team_name}</th>
                                <td className="py-2 text-sm text-slate-900">
                                    {awayBattery?.pitcher_name}-{awayBattery?.catcher_name}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <p className="mb-4 text-xl font-bold text-slate-900">打撃成績</p>
                <div className="overflow-x-auto border border-gray-200 shadow-sm bg-white">
                    <table className="w-full min-w-[900px] border-collapse">
                        <thead className="border-b border-gray-200 bg-gray-50 text-base font-medium text-gray-500">
                            <tr>
                                <th className="px-3 py-3 text-center">打順</th>
                                <th className="px-3 py-3 text-center">位置</th>
                                <th className="px-3 py-3 text-left">選手名</th>
                                <th className="px-3 py-3 text-right">打数</th>
                                <th className="px-3 py-3 text-right">安打</th>
                                <th className="px-3 py-3 text-right">本塁打</th>
                                <th className="px-3 py-3 text-right">打点</th>
                                <th className="px-3 py-3 text-right">二塁打</th>
                                <th className="px-3 py-3 text-right">三塁打</th>
                                <th className="px-3 py-3 text-right">四死球</th>
                                <th className="px-3 py-3 text-right">犠飛</th>
                                <th className="px-3 py-3 text-right">三振</th>
                                <th className="px-3 py-3 text-right">打率</th>
                            </tr>
                        </thead>
                        <tbody className="border-b border-gray-100 text-base text-slate-900">
                                {homeLineup?.map((entry) => {
                                    const stat = result?.batting_stats.find((s) => s.player_id === entry.player_id);
                                    const average = 
                                        stat && stat.at_bats > 0 ? (stat.hits / stat.at_bats).toFixed(3).replace(/^0/, ""): "-";
                                    return (
                                        <tr className="border-b border-gray-100" key={entry.id}>
                                            <td className="px-3 py-3 text-center">{entry.batting_order}</td>
                                            <td className="px-3 py-3 text-center">{entry.position_name}</td>
                                            <td className="px-3 py-3">{entry.player_name}</td>
                                            <td className="px-3 py-3 text-right">{stat?.at_bats}</td>
                                            <td className="px-3 py-3 text-right">{stat?.hits}</td>
                                            <td className="px-3 py-3 text-right">{stat?.home_runs}</td>
                                            <td className="px-3 py-3 text-right">{stat?.runs_batted_in}</td>
                                            <td className="px-3 py-3 text-right">{stat?.doubles}</td>
                                            <td className="px-3 py-3 text-right">{stat?.triples}</td>
                                            <td className="px-3 py-3 text-right">{stat?.walks}</td>
                                            <td className="px-3 py-3 text-right">{stat?.sacrifice_flies}</td>
                                            <td className="px-3 py-3 text-right">{stat?.strikeouts}</td>
                                            <td className="px-3 py-3 text-right">{average}</td>
                                        </tr>
                                    );
                                })}
                            <tr className="bg-gray-50 font-bold text-lg text-slate-900">
                                <td colSpan={3} className="px-3 py-3">TOTAL</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.at_bats}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.hits}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.home_runs}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.runs_batted_in}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.doubles}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.triples}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.walks}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.sacrifice_flies}</td>
                                <td className="px-3 py-3 text-right">{homeTotal?.strikeouts}</td>
                                <td className="px-3 py-3 text-right">{homeTotalAverage}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <Link
                    to="/results"
                    className="inline-block px-6 py-3 text-base font-bold text-slate-900 border border-gray-300 rounded-full transition-colors hover:bg-gray-50"
                >
                    &lt; 試合結果一覧に戻る
                </Link>
            </div>
        </div>
    )
};

export default ResultDetailCard;
