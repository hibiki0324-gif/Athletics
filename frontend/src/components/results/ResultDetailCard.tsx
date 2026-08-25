import { Link } from "react-router-dom";

function ResultDetailCard(){
    return(
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto py-6 px-6">
            <div className="flex items-center gap-3 text-base text-gray-500">
                <Link to="/" className="hover:underline">TOP</Link>
                <span>&gt;</span>
                <Link to="/results" className="hover:underline">試合結果</Link>
                <span>&gt;</span>
                <span className="text-slate-900 font-medium">試合結果詳細</span>
            </div>
            <div className="bg-white border border-gray-300 shadow-sm py-2 px-6">
                <span className="inline-block px-3 py-1 text-base font-medium text-slate-900 border border-gray-300 rounded-full">
                    2026年シーズン
                </span>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                    2026.08.16
                    <span className="ml-3 text-base font-medium text-gray-600">(日)</span>
                    <span className="ml-3 text-base font-medium text-gray-600">14:00試合開始</span>
                </p>
                <p className="mt-1 text-base text-gray-500">雁の巣レクリエーションセンター</p>
                <div className="flex items-center justify-center gap-10 mt-6 pt-6 pb-10">
                    <div className="text-center">
                        <p className="text-xl font-bold text-slate-900">アスレチックス</p>
                        <p className="mt-2 text-5xl font-bold text-blue-900">1</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-300">-</p>
                    <div className="text-center">
                        <p className="text-xl font-bold text-slate-900">ドルフィンズ</p>
                        <p className="mt-2 text-5xl font-bold text-slate-900">0</p>
                    </div>
                </div>
            </div>

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
                            <td className="px-4 py-3 font-bold ">アスレチックス</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">1</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">1</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-bold ">アスレチックス</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">1</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">0</td>
                            <td className="px-4 py-3 text-center">1</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="border border-gray-200 shadow-sm bg-white px-6 py-5">
                    <p className="mb-3 text-lg font-bold text-slate-900">責任投手</p>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">勝利投手</th>
                                <td className="py-2 text-sm text-slate-900">岡嶋（アスレチックス）</td>
                            </tr>
                            <tr className="border-b border-gray-100">
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">敗戦投手</th>
                                <td className="py-2 text-sm text-slate-900">阿部（ドルフィンズ）</td>
                            </tr>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">セーブ</th>
                                <td className="py-2 text-sm text-slate-900">阿部（ドルフィンズ）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border border-gray-200 shadow-sm bg-white px-6 py-5">
                    <p className="mb-3 text-lg font-bold text-slate-900">本塁打</p>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">アスレチックス</th>
                                <td className="py-2 text-sm text-slate-900">阿部（1号）</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="border border-gray-200 shadow-sm bg-white px-6 py-5">
                    <p className="mb-3 text-lg font-bold text-slate-900">バッテリー</p>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr>
                                <th className="py-2 pr-3 text-left text-sm font-medium text-gray-500">アスレチックス</th>
                                <td className="py-2 text-sm text-slate-900">岡嶋 - 土居ノ内</td>
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
                            <tr>
                                <td className="px-3 py-3 text-center">1</td>
                                <td className="px-3 py-3 text-center">右</td>
                                <td className="px-3 py-3">村田</td>
                                <td className="px-3 py-3 text-right">4</td>
                                <td className="px-3 py-3 text-right">2</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">1</td>
                                <td className="px-3 py-3 text-right">1</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">.333</td>
                            </tr>
                            <tr className="bg-gray-50 font-bold text-lg text-slate-900">
                                <td colSpan={3} className="px-3 py-3">TOTAL</td>
                                <td className="px-3 py-3 text-right">4</td>
                                <td className="px-3 py-3 text-right">2</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">1</td>
                                <td className="px-3 py-3 text-right">1</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">0</td>
                                <td className="px-3 py-3 text-right">.333</td>
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
