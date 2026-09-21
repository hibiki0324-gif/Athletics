import { Link } from "react-router-dom";

function StatsDetail(){
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
                    className="px-4 py-3 text-base text-slate-900 bg-white border border-gray-300 rounded-lg"
                >
                    <option>2026年シーズン</option>
                    {/* 以下3件を絞れるようにするかは検討
                    <option>リーグ戦</option>
                    <option>大会</option>
                    <option>練習試合</option>
                    */}
                </select>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
                <label htmlFor="sort">並び替え</label>
                <select
                    id="sort"
                    className="px-3 py-2 text-base text-slate-900 bg-white border border-gray-300 rounded-lg"
                >
                    <option>打率</option>
                    <option>本塁打</option>
                    <option>打点</option>
                </select>
            </div>

            <div className="overflow-x-auto border border-gray-200 shadow-sm bg-white">
                <table className="w-full min-w-[1400px] border-collapse text-center text-sm text-slate-900 tabular-nums">
                    <thead className="bg-gray-50 border-b border-gray-200 text-base font-medium text-gray-500">
                        <tr>
                            <th className="px-3 py-3 whitespace-nowrap">順位</th>
                            <th className="px-3 py-3 text-left whitespace-nowrap">選手名</th>
                            <th className="px-3 py-3 whitespace-nowrap">試合</th>
                            {/* 並び替え中の項目の列は bg-gray-100 で強調（今は打率で固定。sortKeyの状態を作る時に条件付きにする） */}
                            <th className="px-3 py-3 whitespace-nowrap bg-gray-100 text-slate-900">打率</th>
                            <th className="px-3 py-3 whitespace-nowrap">打席</th>
                            <th className="px-3 py-3 whitespace-nowrap">打数</th>
                            <th className="px-3 py-3 whitespace-nowrap">安打</th>
                            <th className="px-3 py-3 whitespace-nowrap">二塁打</th>
                            <th className="px-3 py-3 whitespace-nowrap">三塁打</th>
                            <th className="px-3 py-3 whitespace-nowrap">本塁打</th>
                            <th className="px-3 py-3 whitespace-nowrap">塁打</th>
                            <th className="px-3 py-3 whitespace-nowrap">打点</th>
                            <th className="px-3 py-3 whitespace-nowrap">三振</th>
                            <th className="px-3 py-3 whitespace-nowrap">四球</th>
                            <th className="px-3 py-3 whitespace-nowrap">死球</th>
                            <th className="px-3 py-3 whitespace-nowrap">犠打</th>
                            <th className="px-3 py-3 whitespace-nowrap">犠飛</th>
                            <th className="px-3 py-3 whitespace-nowrap">盗塁</th>
                            <th className="px-3 py-3 whitespace-nowrap">出塁率</th>
                            <th className="px-3 py-3 whitespace-nowrap">長打率</th>
                            <th className="px-3 py-3 whitespace-nowrap">OPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 text-slate-900 text-base hover:bg-gray-50">
                            <td className="px-3 py-3 font-medium">1</td>
                            <td className="px-3 py-3 text-left">
                                <Link to="#" className="hover:underline">阿部 考太郎</Link>
                            </td>
                            <td className="px-3 py-3">3</td>
                            <td className="px-3 py-3 bg-gray-100 font-bold">.400</td>
                            <td className="px-3 py-3">12</td>
                            <td className="px-3 py-3">10</td>
                            <td className="px-3 py-3">4</td>
                            <td className="px-3 py-3">1</td>
                            <td className="px-3 py-3">0</td>
                            <td className="px-3 py-3">0</td>
                            <td className="px-3 py-3">5</td>
                            <td className="px-3 py-3">1</td>
                            <td className="px-3 py-3">2</td>
                            <td className="px-3 py-3">1</td>
                            <td className="px-3 py-3">1</td>
                            <td className="px-3 py-3">0</td>
                            <td className="px-3 py-3">0</td>
                            <td className="px-3 py-3">1</td>
                            <td className="px-3 py-3">.455</td>
                            <td className="px-3 py-3">.500</td>
                            <td className="px-3 py-3">.955</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default StatsDetail;
