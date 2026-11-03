import type { Season, Team } from "../../../types/match";

type ScheduleFormProps ={
    onSubmit:(e: React.SubmitEvent<HTMLFormElement>)=> void;
    seasons:Season[] | undefined,
    teams:Team[] | undefined,
    inputSeasonId:string,
    setInputSeasonId:(value:string)=>void,
    inputDate:string,
    setInputDate:(value:string)=>void,
    inputStartTime:string,
    setInputStartTime:(value:string)=>void,
    inputVenue:string,
    setInputVenue:(value:string)=>void,
    inputHomeTeamId:string,
    setInputHomeTeamId:(value:string)=>void,
    inputAwayTeamId:string,
    setInputAwayTeamId:(value:string)=>void,
    clearButton:()=>void,
    isEditing:boolean,
    deleteSubmit:()=>void
};

function ScheduleForm({
        onSubmit,
        seasons,
        teams,
        inputSeasonId,
        setInputSeasonId,
        inputDate,
        setInputDate,
        inputStartTime,
        setInputStartTime,
        inputVenue,
        setInputVenue,
        inputHomeTeamId,
        setInputHomeTeamId,
        inputAwayTeamId,
        setInputAwayTeamId,
        clearButton,
        isEditing,
        deleteSubmit
    }:ScheduleFormProps){

    //有効なチームのみ選択肢に表示
    const activeTeams = teams?.filter((team)=>team.is_active);

    return(
        <div className="h-full bg-white rounded-2xl shadow-md px-10 pt-5 border border-gray-300">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="font-bold text-2xl">試合日程フォーム</h1>
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
                        <label className="text-xl font-bold" htmlFor="season_id">シーズン</label>
                        <select
                            className="w-full h-10 px-3 border border-gray-300 rounded-md"
                            id="season_id"
                            name="season_id"
                            required
                            onChange={(e)=>setInputSeasonId(e.target.value)}
                            value={inputSeasonId}
                        >
                            <option value="">選択してください</option>
                            {seasons?.map((season)=>(
                                <option key={season.id} value={season.id}>{season.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="match_date">試合日</label>
                            <input
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                type="date"
                                id="match_date"
                                name="match_date"
                                required
                                onChange={(e)=>setInputDate(e.target.value)}
                                value={inputDate}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="start_time">開始時刻</label>
                            <input
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                type="time"
                                id="start_time"
                                name="start_time"
                                onChange={(e)=>setInputStartTime(e.target.value)}
                                value={inputStartTime}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xl font-bold" htmlFor="venue">球場</label>
                        <input
                            className="w-full h-10 px-3 border border-gray-300 rounded-md"
                            type="text"
                            id="venue"
                            name="venue"
                            onChange={(e)=>setInputVenue(e.target.value)}
                            value={inputVenue}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="home_team_id">ホーム</label>
                            <select
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                id="home_team_id"
                                name="home_team_id"
                                required
                                onChange={(e)=>setInputHomeTeamId(e.target.value)}
                                value={inputHomeTeamId}
                            >
                                <option value="">選択してください</option>
                                {activeTeams?.map((team)=>(
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-bold" htmlFor="away_team_id">ビジター</label>
                            <select
                                className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                id="away_team_id"
                                name="away_team_id"
                                required
                                onChange={(e)=>setInputAwayTeamId(e.target.value)}
                                value={inputAwayTeamId}
                            >
                                <option value="">選択してください</option>
                                {activeTeams?.map((team)=>(
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>
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

export default ScheduleForm;
