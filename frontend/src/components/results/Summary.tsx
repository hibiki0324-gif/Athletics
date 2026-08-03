
function Summary(){
    return(
        <div className="flex items-center w-full max-w-5xl mx-auto border border-gray-200 rounded-xl shadow-sm bg-white">
            <div className="shrink-0 flex items-center gap-4 bg-slate-900 text-white rounded-xl px-7 py-7">
                <div>
                    <p className="text-base font-bold">yyyy年シーズン</p>
                    <p className="text-xs text-gray-300">最終更新日時点</p>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-5 items-center gap-6 px-10">
                <div className="text-center border-r border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">試合数</p>
                    <p className="text-3xl font-bold text-slate-900">10<span className="text-base font-medium text-gray-500 ml-1">試合</span></p>
                </div>
                <div className="text-center border-r border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">勝利</p>
                    <p className="text-3xl font-bold text-slate-900">5<span className="text-base font-medium text-gray-500 ml-1">勝</span></p>
                </div>
                <div className="text-center border-r border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">敗戦</p>
                    <p className="text-3xl font-bold text-slate-900">5<span className="text-base font-medium text-gray-500 ml-1">敗</span></p>
                </div>
                <div className="text-center border-r border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">引き分け</p>
                    <p className="text-3xl font-bold text-slate-900">0<span className="text-base font-medium text-gray-500 ml-1">分</span></p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500 font-medium">勝率</p>
                    <p className="text-3xl font-bold text-slate-900">.500</p>
                </div>
            </div>
        </div>
    )
};

export default Summary;