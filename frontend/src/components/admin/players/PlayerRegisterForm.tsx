import { Link } from "react-router-dom";

type PlayerRegisterFormProps ={
    onSubmit:(e: React.SubmitEvent<HTMLFormElement>)=> void;
    inputName:string,
    setInputName:(value:string)=>void,
    inputNumber:string,
    setInputNumber:(value:string)=>void,
    inputThrowing:string,
    setInputThrowing:(value:string)=>void,
    inputBatting:string,
    setInputBatting:(value:string)=>void,
    inputImage:string | null,
    setInputImage:(value:string | null)=>void,
};

function PlayerRegisterForm({
        onSubmit,
        inputName,
        setInputName,
        inputNumber,
        setInputNumber,
        inputThrowing,
        setInputThrowing,
        inputBatting,
        setInputBatting,
        inputImage,
        setInputImage
    }:PlayerRegisterFormProps){

    return(
        <div className="flex flex-col gap-8 py-6 px-15">
            <div className="flex items-center gap-3 text-base text-gray-500">
                <Link to="/" className="hover:underline">管理画面TOP</Link>
                <span>&gt;</span>
                <Link to="/players" className="hover:underline">選手管理</Link>
                <span>&gt;</span>
                <span className="text-slate-900 font-medium">選手登録フォーム</span>
            </div>

            <div className="w-full max-w-[600px] mx-auto">
                <h1 className="font-bold text-2xl text-center mb-6">選手登録フォーム</h1>
                <div className="bg-white rounded-2xl shadow-md p-10 border border-gray-300 my-6">
                    <form 
                        className="flex flex-col gap-6"
                        onSubmit={onSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="name">選手名</label>
                            <input 
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                type="text"
                                id="name"
                                name="name"
                                onChange={(e)=>setInputName(e.target.value)}
                                value={inputName}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="uniform_number">背番号</label>
                            <input 
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                type="number"
                                id="uniform_number"
                                name="uniform_number"
                                onChange={(e)=>setInputNumber(e.target.value)}
                                value={inputNumber}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="throwing_hand">投</label>
                            <input 
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                type="text"
                                id="throwing_hand"
                                name="throwing_hand"
                                onChange={(e)=>setInputThrowing(e.target.value)}
                                value={inputThrowing}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="batting_hand">打</label>
                            <input 
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                type="text"
                                id="batting_hand"
                                name="batting_hand"
                                onChange={(e)=>setInputBatting(e.target.value)}
                                value={inputBatting}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="profile_image">選手画像</label>
                            <input 
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                type="text"
                                id="profile_image"
                                name="profile_image"
                                onChange={(e)=>setInputImage(e.target.value)}
                                value={inputImage ?? ""}
                            />
                        </div>
                        <div className="flex justify-center pt-4">
                            <button 
                                className="w-[300px] h-[50px] text-xl text-white bg-[#263A87] rounded-md hover:opacity-90"
                                type="submit"
                            >
                                登録
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default PlayerRegisterForm;