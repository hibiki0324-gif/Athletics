import type { Player } from "../../../types/player";
import { useSearchParams } from "react-router-dom";

type PlayerListProps = {
    players:Player[] | undefined;
    setSearchPlayer:(value:string)=>void
}

function PlayerList({players,setSearchPlayer}:PlayerListProps){

    //クエリパラメータ
    const [,setSearchParams] = useSearchParams();
    //選手人数カウント
    const playerCount = players?.length ?? 0;

    return(
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">選手一覧</h1>
                <span className="text-base text-gray-500">{`全${playerCount}件`}</span>
            </div>

            <div className="my-1">
                <label htmlFor="playerSort" className="sr-only">選手名・背番号で検索</label>
                <input
                    className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700"
                    id="playerSort"
                    type="text"
                    placeholder="選手名を入力して下さい"
                    onChange={(e)=>setSearchPlayer(e.target.value)}
                />
            </div>

            <div className="overflow-y-auto max-h-100 my-1">
                <table className="w-full border-collapse text-base">
                    <thead>
                        <tr>
                            <td className="text-center">ID</td>
                            <td className="text-left">選手名</td>
                            <td className="text-center">背番号</td>
                        </tr>
                    </thead>
                    <tbody>
                        {players?.map((player)=>(
                        <tr key={player.id}
                            className="cursor-pointer border-b border-gray-200 hover:bg-blue-200"
                            onClick={()=>setSearchParams({player_id:String(player.id)})}
                            >
                            <th className="w-10 px-3 py-3 text-center font-medium text-gray-500">
                                {player.id}
                            </th>
                            <td className="px-3 py-3 text-left font-medium text-slate-900">
                                {player.name}
                            </td>
                            <td className="w-10 px-3 py-3 text-right text-slate-900">
                                {player.uniform_number}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default PlayerList;