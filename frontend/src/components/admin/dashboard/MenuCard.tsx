import { Link } from "react-router-dom";

function MenuCard(){
    return(
        <div className="max-w-7xl mx-auto my-10 px-6 flex flex-col gap-9">
            <div className="flex items-end justify-between flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900">管理画面ダッシュボード</h1>
                    <p className="text-sm text-gray-500">各管理機能のメニュー一覧です</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Link
                    to="/admin/players-register"
                    className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-7 transition-all hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5"
                >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="3.5"></circle>
                            <path d="M4.5 20c0-4.1 3.4-6.5 7.5-6.5s7.5 2.4 7.5 6.5"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-lg font-bold text-slate-900">選手管理</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            選手の登録・編集・一覧表示、ポジション設定、在籍状況（論理削除）を管理します。
                        </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-slate-900">
                        <span className="underline">選手一覧・登録へ</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M13 5l7 7-7 7"></path>
                        </svg>
                    </span>
                </Link>

                <Link
                    to="#"
                    className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-7 transition-all hover:shadow-md hover:border-green-300 hover:-translate-y-0.5"
                >
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="4" width="14" height="17" rx="2"></rect>
                            <path d="M9 4h6v2.5H9z"></path>
                            <path d="M8.5 13l2 2 4.5-4.5"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex flex-col gap-1.5">
                            <h2 className="text-lg font-bold text-slate-900">試合結果管理</h2>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                試合日程・結果の登録と一覧表示を行います。
                            </p>
                        </div>
                        <span className="self-start text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                            対戦チーム・シーズンの登録もこちら
                        </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-slate-900">
                        <span className="underline">試合結果一覧・登録へ</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M13 5l7 7-7 7"></path>
                        </svg>
                    </span>
                </Link>

                <Link
                    to="#"
                    className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-7 transition-all hover:shadow-md hover:border-orange-300 hover:-translate-y-0.5"
                >
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="8"></circle>
                            <path d="M6.5 6.5c3 2.5 3 9 0 11.5"></path>
                            <path d="M17.5 6.5c-3 2.5-3 9 0 11.5"></path>
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-lg font-bold text-slate-900">個人成績管理</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            試合ごとの打撃・投球成績の登録と一覧表示を行います。
                        </p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-slate-900">
                        <span className="underline">個人成績一覧・登録へ</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M13 5l7 7-7 7"></path>
                        </svg>
                    </span>
                </Link>

            </div>
        </div>
    )
};

export default MenuCard;
