import type { Position } from "../../../types/player";

type PlayerRegisterFormProps ={
    onSubmit:(e: React.SubmitEvent<HTMLFormElement>)=> void;
    positions:Position[] | undefined,
    inputName:string,
    setInputName:(value:string)=>void,
    inputNumber:string,
    setInputNumber:(value:string)=>void,
    inputThrowing:string,
    setInputThrowing:(value:string)=>void,
    inputBatting:string,
    setInputBatting:(value:string)=>void,
    inputPositions:number[],
    setInputPositions:(value:number[])=>void,
    inputImage:string | null,
    setInputImage:(value:string | null)=>void,
    clearButton:()=>void,
    isEditing:boolean,
    deleteSubmit:()=>void
};

function PlayerRegisterForm({
        onSubmit,
        positions,
        inputName,
        setInputName,
        inputNumber,
        setInputNumber,
        inputThrowing,
        setInputThrowing,
        inputBatting,
        setInputBatting,
        inputPositions,
        setInputPositions,
        inputImage,
        setInputImage,
        clearButton,
        isEditing,
        deleteSubmit
    }:PlayerRegisterFormProps){

    return(
        <div className="h-full bg-white rounded-2xl shadow-md px-10 pt-5 border border-gray-300">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="font-bold text-2xl">選手登録フォーム</h1>
                    <button
                        type="button"
                        onClick={clearButton}
                        className="px-5 py-2 text-base font-bold text-white bg-blue-500 border border-gray-300 rounded-lg transition-colors hover:bg-blue-600"
                    >
                        新規登録
                    </button>
                </div>
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
                            required
                            onChange={(e)=>setInputName(e.target.value)}
                            value={inputName}
                        />
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] gap-4">
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
                            <span className="text-xl font-bold">投打</span>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    type="text"
                                    id="throwing_hand"
                                    name="throwing_hand"
                                    aria-label="投げ手"
                                    required
                                    onChange={(e)=>setInputThrowing(e.target.value)}
                                    value={inputThrowing}
                                />
                                <input
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                    type="text"
                                    id="batting_hand"
                                    name="batting_hand"
                                    aria-label="打席"
                                    required
                                    onChange={(e)=>setInputBatting(e.target.value)}
                                    value={inputBatting}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xl font-bold">ポジション</label>
                        <div className="flex flex-wrap gap-4">
                            {positions?.map((position)=>(
                                <label key={position.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={inputPositions.includes(position.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setInputPositions([...inputPositions, position.id]);
                                        } else {
                                            setInputPositions(inputPositions.filter((id) => id !== position.id));
                                        }
                                    }}
                                />
                                {position.name}
                                </label>
                            ))}
                        </div>
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
                    {isEditing ? (
                            <div className="flex justify-center gap-4 pt-4 mb-8">
                                <button
                                    type="submit"
                                    className="w-40 h-13 text-xl text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-700"
                                >
                                    更新
                                </button>
                                <button
                                    type="button"
                                    onClick={deleteSubmit}
                                    className="w-40 h-13 text-xl text-white bg-red-500 rounded-md transition-colors hover:bg-red-700"
                                >
                                    削除
                                </button>
                            </div>
                    ):(
                        <div className="flex justify-center pt-4 mb-8">
                            <button
                                className="w-50 h-13 text-xl text-white bg-blue-500 rounded-md hover:opacity-90"
                                type="submit"
                            >
                                登録
                            </button>
                        </div>
                    )}
                </form>
        </div>
    )
};

export default PlayerRegisterForm;