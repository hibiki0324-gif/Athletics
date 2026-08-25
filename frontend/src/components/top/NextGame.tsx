import { Link } from "react-router-dom";

function NextGame(){
    return(
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white px-6 py-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-slate-900">
                    NEXT GAME
                    <span className="block mt-2 text-sm font-medium text-gray-500">次の試合日程</span>
                </p>
                <Link to="#" className="text-sm font-medium text-gray-500 hover:underline">
                    試合日程を見る<span className="ml-1">&gt;</span>
                </Link>
            </div>
            <div>
                <p className="text-xl font-bold text-slate-900 py-4">
                    2026.08.16
                    <span className="ml-3 text-base font-medium text-gray-600">(日)</span>
                    <span className="ml-3 text-base font-medium text-gray-600">14:00試合開始</span>
                    <span className="block text-base font-medium text-gray-600">雁の巣レクリエーションセンター</span>
                </p>
                <div className="flex items-center justify-center mt-6 pt-6 pb-4">
                    <p className="text-xl font-bold text-slate-900">アスレチックス</p>
                    <p className="ml-2 text-xl font-bold text-slate-900">VS</p>
                    <p className="ml-2 text-xl font-bold text-slate-900">ドルフィンズ</p>
                </div>
            </div>
        </div>
    )
};

export default NextGame;