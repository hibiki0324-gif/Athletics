import { Link } from "react-router-dom";

function News(){
    return(
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white px-6 py-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-slate-900">
                    NEWS
                    <span className="block mt-1 text-sm font-medium text-gray-500">ニュース</span>
                </p>
                <Link to="#" className="text-sm font-medium text-gray-500 hover:underline">
                    一覧を見る<span className="ml-1">&gt;</span>
                </Link>
            </div>
            <table className="w-full border-collapse">
                <thead className="sr-only">
                    <tr>
                        <th>更新日</th>
                        <th>カテゴリー</th>
                        <th>内容</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-100 last:border-0">
                        <td className="py-3 pr-4 text-base text-gray-500 whitespace-nowrap">2026.08.24</td>
                        <td className="py-3 pr-4">
                            <span className="inline-block px-2 py-2 text-xs font-bold text-white bg-blue-900 rounded whitespace-nowrap">
                                試合結果情報
                            </span>
                        </td>
                        <td className="py-3 text-sm text-slate-900">
                            試合結果を更新しました【2026.08.23 VS ドルフィンズ】
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default News;