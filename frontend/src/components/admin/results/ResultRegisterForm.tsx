
import { useSearchParams } from "react-router-dom";
import type { MatchDetail, MatchSummary } from "../../../types/match";
import type { Player } from "../../../types/player";

type ResultRegisterProps ={
    onSubmit:(e:React.SubmitEvent<HTMLFormElement>)=>void,
    clearButton:()=>void,
    selectedMatch:MatchDetail | undefined;
    results:MatchSummary[] | undefined;
    players:Player[] | undefined;
    myTeamScore:number | undefined,
    setMyTeamScore:(value:number)=>void,
    awayTeamScore:number | undefined,
    setAwayTeamScore:(value:number)=>void,
    myInnings:number[],
    setMyInnings:(value:number[])=>void,
    awayInnings:number[],
    setAwayInnings:(value:number[])=>void,
    pitcherId:number | undefined,
    setPitcherId:(value:number)=>void,
    catcherId:number | undefined,
    setCatcherId:(value:number)=>void,
    winPitcherId:number | undefined,
    setWinPitcherId:(value:number)=>void,
    lossPitcherId:number | undefined,
    setLossPitcherId:(value:number)=>void,
    savePitcherId:number | undefined,
    setSavePitcherId:(value:number)=>void,
}

function ResultRegisterForm({
    onSubmit,
    clearButton,
    selectedMatch,
    results,
    players,
    myTeamScore,
    setMyTeamScore,
    awayTeamScore,
    setAwayTeamScore,
    myInnings,
    setMyInnings,
    awayInnings,
    setAwayInnings,
    pitcherId,
    setPitcherId,
    catcherId,
    setCatcherId,
    winPitcherId,
    setWinPitcherId,
    lossPitcherId,
    setLossPitcherId,
    savePitcherId,
    setSavePitcherId,
    }:ResultRegisterProps){

    //試合選択プルダウン（ResultListの行クリックと同じクエリパラメータを使う）
    const [,setSearchParams] = useSearchParams();

    //対戦カード（チーム・先攻後攻は試合日程管理で確定済み、ここでは表示のみ）
    const myTeam = selectedMatch?.teams.find((team)=>team.team_name === "アスレチックス");
    const awayTeam = selectedMatch?.teams.find((team)=>team.team_name !== "アスレチックス");
    const isMyTeamHome = myTeam?.is_home ?? true;

    //いずれかのチームにイニングスコアが1件もなければ、まだ結果が未登録の試合（ボタン表示の切り分け用）
    const hasResult = selectedMatch?.innings.some((team)=>team.innings.length > 0) ?? false;

    //スコア合計 "R列"
    const myTotal = myInnings.reduce((sum, runs) => sum + runs, 0);
    const awayTotal = awayInnings.reduce((sum, runs) => sum + runs, 0);

    //自チームスコア入力
    const myTeamRow = (
        <tr className="border-b border-gray-200 h-10">
            <td className="px-2 py-1 text-left font-medium text-gray-700 border border-gray-200">
                {myTeam?.team_name}
            </td>
            {myInnings.map((runs,index)=>(
                <td key={index} className="p-1 border border-gray-200">
                    <input
                        type="number"
                        value={runs}
                        className="w-full h-8 text-center border border-gray-300 rounded"
                        onChange={(e)=>{
                            const updated = [...myInnings];
                            updated[index] = Number(e.target.value);
                            setMyInnings(updated);
                        }}
                    />
                </td>
            ))}
            <td className="p-1 border border-gray-200 font-bold text-gray-900">{myTotal}</td>
        </tr>
    );

    //相手チームスコア入力
    const awayTeamRow = (
        <tr className="border-b border-gray-200 h-10">
            <td className="px-2 py-1 text-left font-medium text-gray-700 border border-gray-200">
                {awayTeam?.team_name}
            </td>
            {awayInnings.map((runs,index)=>(
                <td key={index} className="p-1 border border-gray-200">
                    <input
                        type="number"
                        value={runs}
                        className="w-full h-8 text-center border border-gray-300 rounded"
                        onChange={(e)=>{
                            const updated = [...awayInnings];
                            updated[index] = Number(e.target.value);
                            setAwayInnings(updated);
                        }}
                    />
                </td>
            ))}
            <td className="p-1 border border-gray-200 font-bold text-gray-900">{awayTotal}</td>
        </tr>
    );

    return(
        <div className="h-full bg-white rounded-2xl shadow-md px-10 pt-5 border border-gray-300">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl">試合結果入力フォーム</h1>
                <button
                    type="button"
                    className="px-5 py-2 text-base font-bold text-white bg-blue-500 border border-gray-300 rounded-lg transition-colors hover:bg-blue-600"
                    onClick={clearButton}
                >
                    選択解除
                </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
                <label className="text-sm font-bold text-gray-600" htmlFor="matchSelect">試合選択</label>
                <select
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                    id="matchSelect"
                    value={selectedMatch?.id ?? ""}
                    onChange={(e)=>setSearchParams({ result_id: e.target.value })}
                >
                    <option value="" disabled>選択してください</option>
                    {results?.map((result)=>{
                        const opponentTeam = result.teams.find((team)=>team.team_name !== "アスレチックス");
                        return(
                            <option key={result.id} value={result.id}>
                                {`${result.match_date.replaceAll("-", "/")} VS${opponentTeam?.team_name ?? ""}`}
                            </option>
                        );
                    })}
                </select>
            </div>

            {!selectedMatch || !myTeam || !awayTeam ? (
                <div className="flex items-center justify-center h-80 text-base text-gray-500">
                    試合結果一覧から結果を入力する試合を選択してください
                </div>
            ) : (
                <form
                    className="flex flex-col gap-6"
                    onSubmit={onSubmit}
                >
                    <div className="flex flex-col gap-8 pb-8">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-base font-bold text-slate-900">基本情報</h2>
                            <div className="grid grid-cols-3 gap-4 text-base text-gray-700">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-gray-600">日付</span>
                                    <span>{selectedMatch.match_date.replaceAll("-", "/")}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-gray-600">球場</span>
                                    <span>{selectedMatch.venue ?? "-"}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-gray-600">シーズン</span>
                                    <span>{selectedMatch.season.name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
                            <h2 className="text-base font-bold text-slate-900">対戦カード・最終スコア</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600" htmlFor="myTeamScore">
                                        {`${myTeam.team_name}（自チーム）得点`}
                                    </label>
                                    <input
                                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                        type="number"
                                        id="myTeamScore"
                                        onChange={(e)=>setMyTeamScore(Number(e.target.value))}
                                        value={myTeamScore}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600" htmlFor="awayTeamScore">
                                        {`${awayTeam.team_name}（相手チーム）得点`}
                                    </label>
                                    <input
                                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                        type="number"
                                        id="awayTeamScore"
                                        onChange={(e)=>setAwayTeamScore(Number(e.target.value))}
                                        value={awayTeamScore}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
                            <h2 className="text-base font-bold text-slate-900">イニングスコア</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-base text-center">
                                    <thead>
                                        <tr>
                                            <th className="px-2 py-2 w-22 text-left text-gray-500 font-semibold border border-gray-200">TEAM</th>
                                            <th className="px-2 py-2 w-8 text-gray-500 font-semibold border border-gray-200">1</th>
                                            <th className="px-2 py-2 w-8 text-gray-500 font-semibold border border-gray-200">2</th>
                                            <th className="px-2 py-2 w-8 text-gray-500 font-semibold border border-gray-200">3</th>
                                            <th className="px-2 py-2 w-8 text-gray-500 font-semibold border border-gray-200">4</th>
                                            <th className="px-2 py-2 w-8 text-gray-500 font-semibold border border-gray-200">5</th>
                                            <th className="px-2 py-2 w-8 text-gray-500 font-semibold border border-gray-200">6</th>
                                            <th className="px-2 py-2 w-8 text-gray-500 font-semibold border border-gray-200">7</th>
                                            <th className="px-2 py-2 w-8 text-gray-700 font-bold border border-gray-200">R</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isMyTeamHome ? (
                                            <>
                                                {awayTeamRow}
                                                {myTeamRow}
                                            </>
                                        ) : (
                                            <>
                                                {myTeamRow}
                                                {awayTeamRow}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
                            <h2 className="text-base font-bold text-slate-900">バッテリー・責任投手</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600" htmlFor="pitcher">投手</label>
                                    <select
                                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                        id="pitcher"
                                        value={pitcherId ?? ""}
                                        onChange={(e)=>setPitcherId(Number(e.target.value))}
                                    >
                                        <option value="" disabled>選択してください</option>
                                        {players?.map((player)=>(
                                            <option key={player.id} value={player.id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600" htmlFor="catcher">捕手</label>
                                    <select
                                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                        id="catcher"
                                        value={catcherId ?? ""}
                                        onChange={(e)=>setCatcherId(Number(e.target.value))}
                                    >
                                        <option value="" disabled>選択してください</option>
                                        {players?.map((player)=>(
                                            <option key={player.id} value={player.id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600" htmlFor="winPitcher">勝利投手</label>
                                    <select
                                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                        id="winPitcher"
                                        value={winPitcherId ?? ""}
                                        onChange={(e)=>setWinPitcherId(Number(e.target.value))}
                                    >
                                        <option value="" disabled>対象者なし</option>
                                        {players?.map((player)=>(
                                            <option key={player.id} value={player.id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600" htmlFor="lossPitcher">敗戦投手</label>
                                    <select
                                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                        id="lossPitcher"
                                        value={lossPitcherId ?? ""}
                                        onChange={(e)=>setLossPitcherId(Number(e.target.value))}
                                    >
                                        <option value="" disabled>対象者なし</option>
                                        {players?.map((player)=>(
                                            <option key={player.id} value={player.id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-600" htmlFor="savePitcher">セーブ</label>
                                    <select
                                        className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                        id="savePitcher"
                                        value={savePitcherId ?? ""}
                                        onChange={(e)=>setSavePitcherId(Number(e.target.value))}
                                    >
                                        <option value="" disabled>対象者なし</option>
                                        {players?.map((player)=>(
                                            <option key={player.id} value={player.id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center pt-4 mb-8">
                            <button
                                type="submit"
                                className="w-55 h-13 text-xl text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-700"
                            >
                                {hasResult ? "更新" : "登録"}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
};

export default ResultRegisterForm;
