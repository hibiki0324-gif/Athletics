
function ResultCard(){
    return(
        <div className="flex justify-center items-center gap-16 w-full max-w-5xl mx-auto py-9 px-6 border border-gray-200 rounded-xl shadow-sm bg-white transition-shadow hover:shadow-md">
            <div className="shrink-0 text-base text-gray-500 font-medium border-r border-gray-200 pr-16">
                <p>yyyy/mm/dd(日)</p>
                <p>雁の巣レクリエーションセンター</p>
            </div>
            <div className="shrink-0 flex items-center gap-10 border-r border-gray-200 pr-16">
                <div className="flex items-center gap-4">
                    <p className="text-base text-gray-700 font-medium">アスレチックス</p>
                    <p className="text-4xl font-bold text-slate-900">1</p>
                </div>
                <p className="text-2xl font-bold text-gray-300">-</p>
                <div className="flex items-center gap-4">
                    <p className="text-4xl font-bold text-slate-900">0</p>
                    <p className="text-base text-gray-700 font-medium">相手チーム</p>
                </div>
            </div>
            <div className="shrink-0 flex flex-col items-center gap-2">
                <span className="min-w-[64px] text-center px-4 py-2 text-xs font-bold text-white bg-amber-500 rounded">WIN</span>
                <a href="#" className="px-4 py-1 text-sm border border-gray-300 rounded-full transition-colors hover:bg-gray-50">試合詳細</a>
            </div>
        </div>
    )
};

export default ResultCard;