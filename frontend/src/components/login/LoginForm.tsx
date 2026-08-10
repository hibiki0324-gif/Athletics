import { Link } from "react-router-dom";

function LoginForm(){
    return(
        <div className="w-full max-w-4xl mx-auto px-30">
            <form action="#" method="post" className="flex flex-col gap-6">
                <div className="w-full">
                    <label htmlFor="userId" className="block mb-2 text-xl font-bold text-slate-900">
                        ユーザーID
                    </label>
                    <input
                        id="userId"
                        type="text"
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="password" className="block mb-2 text-xl font-bold text-slate-900">
                        パスワード
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700"
                    />
                </div>
                <div className="flex justify-center pt-[20px]">
                    <button
                        type="submit"
                        className="w-60 mr-4 py-4 text-xl font-bold text-white bg-red-500 rounded-md transition-colors hover:bg-red-700">
                        送信
                    </button>
                    <Link to="/"
                        className="text-center w-60 py-4 text-xl font-bold text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-700">
                        戻る
                    </Link>
                </div>
            </form>
        </div>
    )
};

export default LoginForm;