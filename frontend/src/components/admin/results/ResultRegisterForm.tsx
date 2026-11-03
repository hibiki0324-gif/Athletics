
import type { Season, Teams } from "../../../types/match";
import type { Player } from "../../../types/player";

type ResultRegisterProps ={
    clearButton:()=>void,
    onSubmit:(e:React.SubmitEvent<HTMLFormElement>)=>void,
    seasons:Season[] | undefined;
    teams:Teams[] | undefined;
    players:Player[] | undefined;
    matchDate:string,
    setMatchDate:(value:string)=>void,
    venue:string,
    setVenue:(value:string)=>void,
    seasonId:number | undefined,
    setSeasonId:(value:number)=>void,
    myTeamId:number | undefined,
    setMyTeamId:(value:number)=>void,
    awayTeamId:number | undefined,
    setAwayTeamId:(value:number)=>void,
    myTeamScore:number | undefined,
    setMyTeamScore:(value:number)=>void,
    awayTeamScore:number | undefined,
    setAwayTeamScore:(value:number)=>void,
    isMyTeamHome:boolean,
    setIsMyTeamHome:(value:boolean)=>void,
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
    isEditing:boolean,
    deleteSubmit:()=>void
}

function ResultRegisterForm({
    clearButton,
    onSubmit,
    seasons,
    teams,
    players,
    matchDate,
    setMatchDate,
    venue,
    setVenue,
    seasonId,
    setSeasonId,
    myTeamId,
    setMyTeamId,
    awayTeamId,
    setAwayTeamId,
    myTeamScore,
    setMyTeamScore,
    awayTeamScore,
    setAwayTeamScore,
    isMyTeamHome,
    setIsMyTeamHome,
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
    isEditing,
    deleteSubmit
    }:ResultRegisterProps){

    //スコア合計 "R列"
    const myTotal = myInnings.reduce((sum, runs) => sum + runs, 0);
    const awayTotal = awayInnings.reduce((sum, runs) => sum + runs, 0);

    //自チームスコア入力
    const myTeamRow = (
        <tr className="border-b border-gray-200 h-10">
            <td className="px-2 py-1 text-left font-medium text-gray-700 border border-gray-200">
                {teams?.find((team)=>team.id === myTeamId)?.name}
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
                {teams?.find((team)=>team.id === awayTeamId)?.name}
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
                    className="px-5 py-2 text-base font-bold text-white bg-blue-500 border border-gray-300 rounded-lg transition-colors hover:bg-blue-600"
                    onClick={clearButton}
                >
                    新規登録
                </button>
            </div>
            <form 
                className="flex flex-col gap-6"
                onSubmit={onSubmit}
            >
                <div className="flex flex-col gap-8 pb-8">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-base font-bold text-slate-900">基本情報</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="match_date">日付</label>
                                <input
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    type="date"
                                    id="match_date"
                                    onChange={(e)=>setMatchDate(e.target.value)}
                                    value={matchDate}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="venue">球場</label>
                                <input
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    type="text"
                                    id="venue"
                                    onChange={(e)=>setVenue(e.target.value)}
                                    value={venue}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="season">シーズン</label>
                                <select
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    id="season"
                                    value={seasonId ?? ""}
                                    onChange={(e)=>setSeasonId(Number(e.target.value))}
                                >
                                    <option value="" disabled>選択してください</option>
                                    {seasons?.map((season)=>(
                                        <option key={season.id} value={season.id}>
                                            {season.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-6">
                        <h2 className="text-base font-bold text-slate-900">対戦カード・最終スコア</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="myTeam">自チーム</label>
                                <select
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    id="myTeam"
                                    onChange={(e)=>setMyTeamId(Number(e.target.value))}
                                    value={myTeamId ?? ""}
                                >
                                    <option value="" disabled>選択してください</option>
                                    {teams?.map((team)=>(
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="myTeamScore">自チーム得点</label>
                                <input
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    type="number"
                                    id="myTeamScore"
                                    onChange={(e)=>setMyTeamScore(Number(e.target.value))}
                                    value={myTeamScore}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="isMyTeamHome">自チーム(先攻/後攻)</label>
                                <select
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    id="isMyTeamHome"
                                    onChange={(e)=>setIsMyTeamHome(e.target.value === "true")}
                                    value={String(isMyTeamHome)}
                                >
                                    <option value="true">後攻（ホーム）</option>
                                    <option value="false">先攻（アウェイ）</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="awayTeamId">相手チーム</label>
                                <select
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    id="awayTeamId"
                                    onChange={(e)=>setAwayTeamId(Number(e.target.value))}
                                    value={awayTeamId ?? ""}
                                >
                                    <option value="" disabled>選択してください</option>
                                    {teams?.map((team)=>(
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600" htmlFor="awayTeamScore">相手チーム得点</label>
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
                    {isEditing ? (
                        <div className="flex justify-center gap-16 pt-4 mb-8">
                            <button
                                type="submit"
                                className="w-55 h-13 text-xl text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-700"
                            >
                                更新
                            </button>
                            <button
                                type="button"
                                onClick={deleteSubmit}
                                className="w-55 h-13 text-xl text-white bg-red-500 rounded-md transition-colors hover:bg-red-700"
                            >
                                削除
                            </button>
                        </div>
                    ):(
                        <div className="flex justify-center">
                            <button
                                className="w-50 h-13 text-xl text-white bg-blue-500 rounded-md hover:opacity-90"
                                type="submit"
                            >
                                登録
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
};

export default ResultRegisterForm;