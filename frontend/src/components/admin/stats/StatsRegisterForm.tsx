import type { MatchSummary } from "../../../types/match";
import type { Player, Position } from "../../../types/player";
import { useState } from "react";
import type { LineupRow } from "../../../types/stats";

type StatsRegisterFormProps ={
    results:MatchSummary[] | undefined,
    players:Player[] | undefined,
    positions:Position[] | undefined,
    lineupRow:LineupRow[] | undefined,
    battingOrder:number | undefined,
    setBattingOrder:(value:number)=>void,
    playerId:number | undefined,
    setPlayerId:(value:number)=>void,
    positionId:number | undefined,
    setPositionId:(value:number)=>void,
    isStarter:boolean,
    setIsStarter:(value:boolean)=>void,
    entryInning:number | undefined,
    setEntryInning:(value:number)=>void,
    exitInning:number | undefined,
    setExitInning:(value:number)=>void
    createRow:()=>void,
    deleteRow:(index:number)=>void,
    onSubmit:(e:React.SubmitEvent<HTMLFormElement>)=>void
}

function StatsRegisterForm({
    players,
    positions,
    lineupRow,
    battingOrder,
    setBattingOrder,
    playerId,
    setPlayerId,
    positionId,
    setPositionId,
    isStarter,
    setIsStarter,
    entryInning,
    setEntryInning,
    exitInning,
    setExitInning,
    createRow,
    deleteRow,
    onSubmit
}:StatsRegisterFormProps){

    //スタメン/打撃成績フォームの表示切り替えstate
    const [activeTab,setActiveTab] = useState<"lineup" | "batting">("lineup")

    return(
        <div className="h-full min-w-0 bg-white rounded-2xl shadow-md px-10 pt-5 border border-gray-300">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl">個人成績登録フォーム</h1>
                <button
                    className="px-5 py-2 text-base font-bold text-white bg-blue-500 border border-gray-300 rounded-lg transition-colors hover:bg-blue-600"

                >
                    選択解除
                </button>
            </div>
            <div className="border-b border-gray-200 mb-6">
                <ul className="flex gap-1">
                    <li 
                        className={`px-4 py-2 text-base font-semibold cursor-pointer border-b-2 
                            ${activeTab === "lineup" ? "text-blue-800 border-blue-800" : "text-gray-600 border-transparent"}
                        `}
                        onClick={()=>setActiveTab("lineup")}
                    >
                        出場選手登録
                    </li>
                    <li 
                        className={`px-4 py-2 text-base font-semibold cursor-pointer border-b-2 
                            ${activeTab === "batting" ? "text-blue-800 border-blue-800" : "text-gray-600 border-transparent"}
                        `}
                        onClick={()=>setActiveTab("batting")}
                    >
                        打撃成績登録
                    </li>
                </ul>
            </div>
            {/* lineup登録フォーム */}
            {activeTab === "lineup" &&(
            <form
                className="flex flex-col gap-4 pb-8"
                onSubmit={onSubmit}
            >
                <div className="overflow-x-auto max-w-full">
                    <table className="w-full border-collapse text-base text-center">
                        <thead>
                            <tr className="bg-gray-400">
                                <th className="w-12 px-2 py-2 text-white font-semibold border border-gray-200 whitespace-nowrap">打順</th>
                                <th className="w-48 px-2 py-2 text-white font-semibold border border-gray-200 whitespace-nowrap">選手名</th>
                                <th className="w-48 px-2 py-2 text-white font-semibold border border-gray-200 whitespace-nowrap">守備</th>
                                <th className="w-32 px-2 py-2 text-white font-semibold border border-gray-200 whitespace-nowrap">区分</th>
                                <th className="px-2 py-2 text-white font-semibold border border-gray-200 whitespace-nowrap">出場回</th>
                                <th className="px-2 py-2 text-white font-semibold border border-gray-200 whitespace-nowrap">交代回</th>
                                <th className="w-16 px-2 py-2 text-white font-semibold border border-gray-200 whitespace-nowrap">削除</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineupRow?.map((row,index)=>(
                                <tr key={index}
                                    className="border-b border-gray-200 h-10"
                                >
                                    <td className="w-14 p-1 border border-gray-200 font-medium text-gray-700 whitespace-nowrap">
                                        {row.batting_order}
                                    </td>
                                    <td className="w-58 p-1 border border-gray-200 whitespace-nowrap">
                                        {players?.find((player) => player.id === row.player_id)?.name}
                                    </td>
                                    <td className="w-40 p-1 border border-gray-200 whitespace-nowrap">
                                        {positions?.find((position)=>position.id === row.position_id)?.name}
                                    </td>
                                    <td className="w-32 p-1 border border-gray-200 whitespace-nowrap">
                                        {row.is_starter ? "スタメン" : "途中出場"}
                                    </td>
                                    <td className="p-1 border border-gray-200 whitespace-nowrap">
                                        {row.entry_inning}
                                    </td>
                                    <td className="p-1 border border-gray-200 whitespace-nowrap">
                                        {row.exit_inning}
                                    </td>
                                    <td className="p-1 border border-gray-200 whitespace-nowrap">
                                        <button
                                            type="button"
                                            className="px-2 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                            onClick={()=>deleteRow(index)}
                                        >
                                            削除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            
                            <tr className="border-b border-gray-200 h-10">
                                <td className="w-14 p-1 border border-gray-200 font-medium text-gray-700 whitespace-nowrap">
                                    <input
                                        className="w-14 h-9 px-2 border border-gray-300 rounded-md text-sm text-center"
                                        type="number"
                                        value={battingOrder ?? ""}
                                        onChange={(e)=>setBattingOrder(Number(e.target.value))}
                                    />
                                </td>
                                <td className="w-58 p-1 border border-gray-200 whitespace-nowrap">
                                    <select
                                        className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm"
                                        value={playerId ?? ""}
                                        onChange={(e)=>setPlayerId(Number(e.target.value))}
                                    >
                                        <option value="">選択して下さい</option>
                                        {players?.map((player)=>(
                                            <option key={player.id} value={player.id}>
                                                {player.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="w-40 p-1 border border-gray-200 whitespace-nowrap">
                                    <select
                                        className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm"
                                        value={positionId ?? ""}
                                        onChange={(e)=>setPositionId(Number(e.target.value))}
                                    >
                                        <option value="">選択して下さい</option>
                                        {positions?.map((position)=>(
                                            <option key={position.id} value={position.id}>
                                                {position.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="w-32 p-1 border border-gray-200 whitespace-nowrap">
                                    <select
                                        className="w-full h-9 px-2 border border-gray-300 rounded-md text-sm"
                                        value={isStarter ? "スタメン" : "途中出場"}
                                        onChange={(e) => setIsStarter(e.target.value === "スタメン")}
                                    >
                                        <option value="スタメン">スタメン</option>
                                        <option value="途中出場">途中出場</option>
                                    </select>
                                </td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap">
                                    <input
                                        className="w-16 h-9 px-2 border border-gray-300 rounded-md text-sm text-center"
                                        type="number"
                                        value={entryInning  ?? ""}
                                        onChange={(e)=>setEntryInning(Number(e.target.value))}
                                    />
                                </td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap">
                                    <input
                                        className="w-16 h-9 px-2 border border-gray-300 rounded-md text-sm text-center"
                                        type="number"
                                        value={exitInning  ?? ""}
                                        onChange={(e)=>setExitInning(Number(e.target.value))}
                                    />
                                </td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* 打順を追加clickで行を追加 */}
                <button 
                    className="self-start px-4 py-2 text-base text-gray-600 border border-dashed border-gray-400 rounded-md hover:bg-gray-50"
                    type="button"
                    onClick={createRow}
                >
                    +打順を追加
                </button>
                <button className="self-center w-50 h-13 text-xl text-white bg-blue-500 rounded-md hover:opacity-90 mt-2">登録</button>
            </form>
            )}
            {/* batting-statsフォーム */}
            {activeTab === "batting" &&(
            <form className="flex flex-col gap-4 pb-8">
                <div className="overflow-x-auto max-w-full">
                    <table className="w-full border-collapse text-base text-center">
                        <thead>
                            <tr>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">選手名</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">背番号</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">打数</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">安打</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">二塁打</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">三塁打</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">本塁打</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">打点</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">四球</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">死球</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">犠打</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">犠飛</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">三振</th>
                                <th className="px-2 py-2 text-gray-500 font-semibold border border-gray-200 whitespace-nowrap">盗塁</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-200 h-10">
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                                <td className="p-1 border border-gray-200 whitespace-nowrap"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button className="self-center w-50 h-13 text-xl text-white bg-blue-500 rounded-md hover:opacity-90 mt-2">登録</button>
            </form>
            )}
        </div>
    )
};

export default StatsRegisterForm;
