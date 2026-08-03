
function ResultFilter(){
    return(
        <div className="flex max-w-5xl mx-auto justify-between items-center w-full">
            <div className="flex items-center gap-2">
                <button type="button" className="px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-full">
                    すべて
                </button>
                <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full transition-colors hover:bg-gray-50">
                    勝利
                </button>
                <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full transition-colors hover:bg-gray-50">
                    敗戦
                </button>
                <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full transition-colors hover:bg-gray-50">
                    引き分け
                </button>
            </div>
            <select className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full bg-white">
                <option value="new">新しい順</option>
                <option value="old">古い順</option>
            </select>
        </div>
    )
};

export default ResultFilter;