
function ResultPage() {
    return (
        <div className="flex w-full max-w-5xl mx-auto mb-[20px] justify-center items-center">
            <div className="flex items-center gap-2">
                <button type="button" className="w-9 h-9 flex items-center justify-center text-sm font-bold text-white bg-slate-900 rounded-lg">
                    1
                </button>
                <button type="button" className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-600 rounded-lg transition-colors hover:bg-gray-100">
                    2
                </button>
                <button type="button" className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-600 rounded-lg transition-colors hover:bg-gray-100">
                    3
                </button>
                <span className="w-9 h-9 flex items-center justify-center text-sm text-gray-400">
                    ...
                </span>
                <button type="button" aria-label="次のページ" className="w-9 h-9 flex items-center justify-center text-gray-600 rounded-lg transition-colors hover:bg-gray-100">
                    &gt;
                </button>
            </div>
        </div>
    )
};

export default ResultPage;