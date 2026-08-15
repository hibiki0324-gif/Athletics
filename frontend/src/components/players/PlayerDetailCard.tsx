import { Link } from "react-router-dom";
import type { Player } from "../../types/player";
import playerImg from '../../assets/no-image.png'

type PlayerDetailCardProps = {
    player?: Player;
};

function PlayerDetailCard({ player }: PlayerDetailCardProps){
    if (!player) {
        return <p>選手情報が見つかりませんでした。</p>;
    }

    return(
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-6 px-6">
            <div className="flex items-center gap-3 text-base text-gray-500">
                <Link to="/" className="hover:underline">TOP</Link>
                <span>&gt;</span>
                <Link to="/players" className="hover:underline">選手紹介</Link>
                <span>&gt;</span>
                <span className="text-slate-900 font-medium">選手詳細</span>
            </div>

            <div className="flex items-center gap-6 border border-gray-200 shadow-sm bg-white px-8 py-4">
                <p className="text-6xl font-bold text-blue-900">{player.uniform_number}</p>
                <div>
                    <p className="text-3xl font-bold text-slate-900 pb-2">{player.name}</p>
                    <p className="mt-2 inline-block px-3 py-2 text-base font-medium text-gray-600 border border-gray-300 rounded-full">
                        {player.throwing_hand}投{player.batting_hand}打
                    </p>
                </div>
                <div className="w-[25%] ml-auto">
                    <img src={playerImg} alt="選手画像" className="w-full h-auto object-cover" />
                </div>
            </div>

            <div>
                <p className="mb-4 text-xl font-bold text-slate-900">今シーズン成績</p>
                <div className="grid grid-cols-5 gap-4 border border-gray-200 shadow-sm bg-white px-6 py-5 md:grid-cols-10">
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        試合数<span className="text-2xl font-bold text-slate-900">18</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        打率<span className="text-2xl font-bold text-slate-900">.352</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        安打<span className="text-2xl font-bold text-slate-900">25</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        本塁打<span className="text-2xl font-bold text-slate-900">5</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        打点<span className="text-2xl font-bold text-slate-900">18</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        得点<span className="text-2xl font-bold text-slate-900">14</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        盗塁<span className="text-2xl font-bold text-slate-900">6</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        出塁率<span className="text-2xl font-bold text-slate-900">.432</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        長打率<span className="text-2xl font-bold text-slate-900">.621</span>
                    </p>
                    <p className="flex flex-col items-center gap-1 text-sm text-gray-500 font-medium">
                        OPS<span className="text-2xl font-bold text-slate-900">1.053</span>
                    </p>
                </div>
            </div>

            <div>
                <p className="mb-4 text-xl font-bold text-slate-900">年度別打撃成績</p>
                <div className="overflow-x-auto border border-gray-200 shadow-sm bg-white">
                    <table className="w-full min-w-[720px] border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-600 text-white font-bold text-base">
                                <th className="px-4 py-3 text-left">年度</th>
                                <th className="px-4 py-3 text-right">試合</th>
                                <th className="px-4 py-3 text-right">打率</th>
                                <th className="px-4 py-3 text-right">安打</th>
                                <th className="px-4 py-3 text-right">本塁打</th>
                                <th className="px-4 py-3 text-right">打点</th>
                                <th className="px-4 py-3 text-right">得点</th>
                                <th className="px-4 py-3 text-right">盗塁</th>
                                <th className="px-4 py-3 text-right">出塁率</th>
                                <th className="px-4 py-3 text-right">長打率</th>
                                <th className="px-4 py-3 text-right">OPS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100 last:border-0 text-lg text-slate-900">
                                <td className="px-4 py-3 ">2026</td>
                                <td className="px-4 py-3 text-right">18</td>
                                <td className="px-4 py-3 text-right">.352</td>
                                <td className="px-4 py-3 text-right">25</td>
                                <td className="px-4 py-3 text-right">5</td>
                                <td className="px-4 py-3 text-right">18</td>
                                <td className="px-4 py-3 text-right">14</td>
                                <td className="px-4 py-3 text-right">6</td>
                                <td className="px-4 py-3 text-right">.432</td>
                                <td className="px-4 py-3 text-right">.621</td>
                                <td className="px-4 py-3 text-right">1.053</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <Link
                    to="/players"
                    className="inline-block px-6 py-3 text-base font-bold text-slate-900 border border-gray-300 rounded-full transition-colors hover:bg-gray-50"
                >
                    &lt; 選手一覧に戻る
                </Link>
            </div>
        </div>
    )
};

export default PlayerDetailCard;