import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ScheduleForm from "../../components/admin/schedule/ScheduleForm";
import ScheduleList from "../../components/admin/schedule/ScheduleList";
import Title from "../../components/admin/schedule/Title";
import type { MatchSummary, Season, Team } from "../../types/match";


function ScheduleEdit() {

    /* シーズンデータを取得 */
    const [seasons,setSeasons] = useState<Season[] | undefined>(undefined);

    useEffect(()=>{
        const getSeasons = async()=>{
            try{
                const seasonResponse = await fetch("http://localhost:8000/seasons");

                if(!seasonResponse.ok){
                    throw new Error("シーズンデータの取得に失敗しました。");
                }

                const seasonResponseData:Season[] = await seasonResponse.json();
                setSeasons(seasonResponseData);
            }
            catch(error){
                alert(error);
            }
        }
        getSeasons();

    },[])

    /* チームデータを取得 */
    const [teams,setTeams] = useState<Team[] | undefined>(undefined);

    useEffect(()=>{
        const getTeams = async()=>{
            try{
                const teamResponse = await fetch("http://localhost:8000/teams");

                if(!teamResponse.ok){
                    throw new Error("チームデータの取得に失敗しました。");
                }

                const teamResponseData:Team[] = await teamResponse.json();
                setTeams(teamResponseData);
            }
            catch(error){
                alert(error);
            }
        }
        getTeams();

    },[])

    /* 試合データを取得（登録・更新・削除後にも再取得する） */
    const [matches,setMatches] = useState<MatchSummary[] | undefined>(undefined);

    const getMatches = async()=>{
        try{
            const matchResponse = await fetch("http://localhost:8000/matches");

            if(!matchResponse.ok){
                throw new Error("試合日程を取得できませんでした。");
            }

            const matchResponseData:MatchSummary[] = await matchResponse.json();
            setMatches(matchResponseData);
        }
        catch(error){
            alert(error);
        }
    }

    useEffect(()=>{
        getMatches();
    },[])

    /* 年で絞り込み（当年は試合がなくても選択できる） */
    const currentYear = String(new Date().getFullYear());
    const [selectedYear,setSelectedYear] = useState<string>(currentYear);

    const availableYears = useMemo(()=>{
        const years = new Set<string>([currentYear]);
        matches?.forEach((match)=>years.add(match.match_date.slice(0,4)));

        return Array.from(years).sort((a,b)=>b.localeCompare(a));
    },[matches,currentYear]);

    const yearlyMatches =
        matches?.filter((match)=>match.match_date.slice(0,4) === selectedYear);

    /* 試合日程の入力値 */
    const [inputSeasonId, setInputSeasonId] = useState<string>("");
    const [inputDate, setInputDate] = useState<string>("");
    const [inputStartTime, setInputStartTime] = useState<string>("");
    const [inputVenue, setInputVenue] = useState<string>("");
    const [inputHomeTeamId, setInputHomeTeamId] = useState<string>("");
    const [inputAwayTeamId, setInputAwayTeamId] = useState<string>("");

    //クエリパラメータ取得
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedId = searchParams.get("match_id");
    const selectedMatch = matches?.find((match) => match.id === Number(selectedId));

    const selectedHomeTeamId = selectedMatch?.teams.find((team)=>team.is_home)?.team_id;
    const selectedAwayTeamId = selectedMatch?.teams.find((team)=>!team.is_home)?.team_id;

    //クエリパラメータのvalueでフォームの値を入力
    useEffect(()=>{

        if(selectedMatch){
            setInputSeasonId(String(selectedMatch.season_id));
            setInputDate(selectedMatch.match_date);
            setInputStartTime(selectedMatch.start_time?.slice(0,5) ?? "");
            setInputVenue(selectedMatch.venue ?? "");
            setInputHomeTeamId(selectedHomeTeamId ? String(selectedHomeTeamId) : "");
            setInputAwayTeamId(selectedAwayTeamId ? String(selectedAwayTeamId) : "");
        }

    },[selectedMatch, selectedHomeTeamId, selectedAwayTeamId]);

    //Formクリア（新規登録ボタン）
    const clearButton = () => {
        setInputSeasonId("");
        setInputDate("");
        setInputStartTime("");
        setInputVenue("");
        setInputHomeTeamId("");
        setInputAwayTeamId("");
        setSearchParams({});
    }

    //新規登録ボタン押下時、入力中の内容があれば破棄してよいか確認する
    const handleNewButton = () => {
        const hasInput = [
            inputSeasonId,
            inputDate,
            inputStartTime,
            inputVenue,
            inputHomeTeamId,
            inputAwayTeamId,
        ].some((value) => value !== "");

        if (hasInput && !window.confirm("現在の入力内容は消去されます。よろしいですか？")) return;

        clearButton();
    }

    /* 試合日程登録・更新(Match+MatchTeam) */
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(inputHomeTeamId === inputAwayTeamId){
            alert("ホームとビジターに同じチームは指定できません。");
            return;
        }

        //対戦チームの登録は既存のチームを削除して作り直すため、
        //試合結果が登録済みの場合は結果も削除される
        const isTeamsChanged =
            String(selectedHomeTeamId ?? "") !== inputHomeTeamId ||
            String(selectedAwayTeamId ?? "") !== inputAwayTeamId;

        if(
            selectedMatch &&
            selectedMatch.teams.length > 0 &&
            isTeamsChanged &&
            !window.confirm("対戦チームを変更すると、この試合の結果データは削除されます。よろしいですか？")
        ) return;

        const matchData = {
            season_id: Number(inputSeasonId),
            match_date: inputDate,
            start_time: inputStartTime || null,
            venue: inputVenue || null,
        }

        const postMatch = async () => {

            try {
                let matchId: number;

                if (selectedMatch) {
                    /* 更新 */
                    const matchRequest = await fetch(`http://localhost:8000/matches/${selectedMatch.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(matchData),
                    })

                    if (!matchRequest.ok) {
                        const errorData = await matchRequest.json();
                        throw new Error(errorData.detail);
                    }

                    matchId = selectedMatch.id;

                } else {
                    /* 新規登録 */
                    const matchRequest = await fetch("http://localhost:8000/matches", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(matchData),
                    })

                    if (!matchRequest.ok) {
                        const errorData = await matchRequest.json();
                        throw new Error(errorData.detail);
                    }

                    const newMatch = await matchRequest.json();
                    matchId = newMatch.id;
                }

                /* 対戦チーム登録は新規、またはチームが変わった時のみ */
                if (isTeamsChanged) {
                    const teamsRequest = await fetch(`http://localhost:8000/matches/${matchId}/teams`,{
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            teams: [
                                { team_id: Number(inputHomeTeamId), is_home: true },
                                { team_id: Number(inputAwayTeamId), is_home: false },
                            ],
                        }),
                    });

                    if(!teamsRequest.ok){
                        const errorData = await teamsRequest.json();
                        throw new Error(errorData.detail);
                    }
                }

                alert(selectedMatch ? "更新完了" : "登録完了");
                clearButton();
                getMatches();

            }
            catch (error) {
                alert(error);
            }
        }
        postMatch();
    }

    //試合日程削除（試合結果が登録済みの場合はAPI側で拒否される）
    const handleDelete = () => {
        if(!selectedMatch)return;
        if (!window.confirm("この試合日程を削除しますか？")) return;

        const deleteMatch = async() => {

            try{
                const deleteMatchRequest = await fetch(`http://localhost:8000/matches/${selectedMatch.id}`,{
                    method: "DELETE",
                })

                if(!deleteMatchRequest.ok){
                    const errorData = await deleteMatchRequest.json();
                    throw new Error(errorData.detail);
                }

                alert("試合日程を削除しました。");
                clearButton();
                getMatches();

            } catch(error){
                alert(error)
            }
        };

        deleteMatch();

    };

    return (
        <div>
            <Title />
            <div className="grid grid-cols-2 gap-14 my-10 max-w-7xl mx-auto">
                <ScheduleList
                    matches={yearlyMatches}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    availableYears={availableYears}
                />
                <ScheduleForm
                    onSubmit={handleSubmit}
                    seasons={seasons}
                    teams={teams}
                    inputSeasonId={inputSeasonId} setInputSeasonId={setInputSeasonId}
                    inputDate={inputDate} setInputDate={setInputDate}
                    inputStartTime={inputStartTime} setInputStartTime={setInputStartTime}
                    inputVenue={inputVenue} setInputVenue={setInputVenue}
                    inputHomeTeamId={inputHomeTeamId} setInputHomeTeamId={setInputHomeTeamId}
                    inputAwayTeamId={inputAwayTeamId} setInputAwayTeamId={setInputAwayTeamId}
                    clearButton={handleNewButton}
                    isEditing={!!selectedMatch}
                    deleteSubmit={handleDelete}
                />
            </div>
        </div>
    )
};

export default ScheduleEdit;
