import ResultRegisterForm from "../../components/admin/results/ResultRegisterForm";
import ResultList from "../../components/admin/results/ResultList";
import Title from "../../components/admin/results/Title";
import { useEffect, useState } from "react";
import { type MatchDetail, type MatchSummary,type MatchTeam,type Season,type Team} from "../../types/match";
import type { Player } from "../../types/player";
import { useSearchParams } from "react-router-dom";

function ResultRegister(){

    //ResultList用
    //試合結果一覧取得
    const [results,setResults] = useState<MatchSummary[] | undefined>(undefined);

    useEffect(()=>{

        const getResult = async()=>{
            try{
                const resultRes = await fetch(`http://localhost:8000/matches`);
                if(!resultRes.ok){
                    throw new Error("試合結果一覧が取得できませんでした。");
                }

                const resultResData:MatchSummary[] = await resultRes.json();
                setResults(resultResData);

            }catch(error){
                alert(error);
            }
        }

        getResult();

    },[]);

    //対戦相手検索機能
    const [searchTeam,setSearchTeam] = useState<string>("");

    const filterTeam = results?.filter((result) => {
        const opponentTeam = result.teams.find((team) => team.team_name !== "アスレチックス");
        return(
            opponentTeam?.team_name.includes(searchTeam)
        )
    });

    //ResultRegisterForm用
    //シーズンデータ取得
    const [seasons,setSeasons] = useState<Season[] | undefined>(undefined);

    useEffect(()=>{

        const fetchSeasons = async()=>{
            try{
                const seasonRes = await fetch("http://localhost:8000/seasons");
                if(!seasonRes.ok){
                    throw new Error("シーズン情報を取得できませんでした。")
                }

                const seasonResData:Season[] = await seasonRes.json();
                setSeasons(seasonResData);

            }catch(error){
                alert(error)
            } 
        }

        fetchSeasons();

    },[]);

    //チームデータ取得
    const [teams,setTeams] = useState<Team[] | undefined>(undefined);

    useEffect(()=>{

        const getTeams = async()=>{
            const teamRes = await fetch("http://localhost:8000/teams");

            if(!teamRes.ok){
                throw new Error("チーム情報を取得できませんでした。");
            }

            const teamData:Team[] = await teamRes.json();
            setTeams(teamData);
        }

        getTeams();

    },[]);

    //選手データ取得
    const [players,setPlayers] = useState<Player[] | undefined>(undefined);

    useEffect(()=>{
        const getPlayers = async()=>{
            const playerRes = await fetch("http://localhost:8000/players");

            if(!playerRes.ok){
                throw new Error("選手情報を取得できませんでした。");
            }

            const playerData:Player[] = await playerRes.json();
            setPlayers(playerData);
        }

        getPlayers();

    },[])

    //試合結果登録・更新・論理削除機能
    const [matchDate,setMatchDate] = useState<string>("");
    const [venue,setVenue] = useState<string>("");
    const [seasonId,setSeasonId] = useState<number | undefined>(undefined);
    const [myTeamId,setMyTeamId] = useState<number | undefined>(undefined);
    const [awayTeamId,setAwayTeamId] = useState<number | undefined>(undefined);
    const [myTeamScore,setMyTeamScore] = useState<number | undefined>(undefined);
    const [awayTeamScore,setAwayTeamScore] = useState<number | undefined>(undefined);
    const [isMyTeamHome,setIsMyTeamHome] = useState<boolean>(true);
    const [myInnings, setMyInnings] = useState<number[]>([0,0,0,0,0,0,0]);
    const [awayInnings, setAwayInnings] = useState<number[]>([0,0,0,0,0,0,0]);
    const [pitcherId,setPitcherId] = useState<number | undefined>(undefined);
    const [catcherId,setCatcherId] = useState<number | undefined>(undefined);
    const [winPitcherId, setWinPitcherId] = useState<number | undefined>(undefined);
    const [lossPitcherId, setLossPitcherId] = useState<number | undefined>(undefined);
    const [savePitcherId, setSavePitcherId] = useState<number | undefined>(undefined);
    const [selectedMatch,setSelectedMatch] = useState<MatchDetail | undefined>(undefined);

    const handleSubmit = (e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault()

        const matchPostData = {
            match_date:matchDate,
            venue:venue,
            season_id:seasonId
        };

        const postMatch = async() => {

            try{
                let newMatchId:number;

                if(selectedMatch){
                    //更新
                    const matchRequest = await fetch(`http://localhost:8000/matches/${selectedMatch.id}`,{
                        method:"PUT",
                        headers:{ "Content-Type": "application/json" },
                        body: JSON.stringify(matchPostData),
                    });

                    if(!matchRequest.ok){
                        const matchErrorData = await matchRequest.json();
                        throw new Error(matchErrorData.detail)
                    };

                    await matchRequest.json();
                    newMatchId = selectedMatch.id;

                }else{
                    //新規登録
                    const matchRequest = await fetch(`http://localhost:8000/matches`,{
                        method:"POST",
                        headers:{ "Content-Type": "application/json" },
                        body: JSON.stringify(matchPostData),
                    });

                    if(!matchRequest.ok){
                        const matchErrorData = await matchRequest.json();
                        throw new Error(matchErrorData.detail)
                    };

                    const matchData = await matchRequest.json();
                    newMatchId = matchData.id;
                }

                //対戦カード・最終スコア登録
                const matchTeamData = {
                    teams: [
                        { //自チームデータ
                            team_id: myTeamId,
                            is_home: isMyTeamHome,
                            final_score: myTeamScore
                        },
                        { //相手チームデータ
                            team_id: awayTeamId,
                            is_home: !isMyTeamHome,
                            final_score: awayTeamScore
                        },
                    ],
                };

                const matchTeamRequest = await fetch(`http://localhost:8000/matches/${newMatchId}/teams`,{
                    method:"PUT",
                    headers:{ "Content-Type": "application/json" },
                    body: JSON.stringify(matchTeamData),
                });

                if(!matchTeamRequest.ok){
                    const matchTeamErrorData = await matchTeamRequest.json();
                    throw new Error(matchTeamErrorData.detail);
                }
                
                const newMatchTeamData:MatchTeam[] = await matchTeamRequest.json();
                const myMatchTeamId = newMatchTeamData.find((team) => team.is_home)?.id;
                const awayMatchTeamId = newMatchTeamData.find((team) => !team.is_home)?.id;

                //イニングスコア登録
                const inningScoreData = {
                    teams: [
                        {
                            //自チームスコアデータ登録
                            match_team_id: myMatchTeamId,
                            innings: myInnings.map((runs, index) => ({
                                inning_number: index + 1,
                                runs: runs,
                            })),
                        },
                        {
                            //相手チームスコアデータ登録
                            match_team_id: awayMatchTeamId,
                            innings: awayInnings.map((runs, index) => ({
                                inning_number: index + 1,
                                runs: runs,
                            })),
                        }
                    ]
                };

                const matchInningsRequest = await fetch(`http://localhost:8000/matches/${newMatchId}/innings`,{
                    method:"PUT",
                    headers:{ "Content-Type": "application/json" },
                    body: JSON.stringify(inningScoreData),
                });

                if(!matchInningsRequest.ok){
                    throw new Error("イニングスコアスコア登録ができませんでした。")
                }

                await matchInningsRequest.json();

                //バッテリー責任投手登録
                const matchBatteryData = {
                    match_team_id:myMatchTeamId,
                    batteries:[
                        {
                            pitcher_id:pitcherId,
                            catcher_id: catcherId,
                            sequence_no: 1,
                            entry_inning: 1,
                            exit_inning: null
                        }
                    ]
                };

                const matchBatteryRequest = await fetch(`http://localhost:8000/matches/${newMatchId}/batteries`,{
                    method:"PUT",
                    headers:{ "Content-Type": "application/json" },
                    body: JSON.stringify(matchBatteryData),
                });

                if(!matchBatteryRequest.ok){
                    throw new Error("バッテリー情報が登録できませんでした。");
                }

                await matchBatteryRequest.json();

                //責任投手登録
                const decisions = [];
                if (winPitcherId) decisions.push({ player_id: winPitcherId, decision: "WIN" });
                if (lossPitcherId) decisions.push({ player_id: lossPitcherId, decision: "LOSS" });
                if (savePitcherId) decisions.push({ player_id: savePitcherId, decision: "SAVE" });

                const matchDecisionsData = { decisions };
                
                const matchDecisionsRequest = await fetch(`http://localhost:8000/matches/${newMatchId}/pitching-decisions`,{
                    method:"PUT",
                    headers:{ "Content-Type": "application/json" },
                    body: JSON.stringify(matchDecisionsData),
                });

                if(!matchDecisionsRequest.ok){
                    throw new Error("責任投手が記録できませんでした。")
                }

                await matchDecisionsRequest.json();
                alert(selectedMatch ? "試合結果が更新されました。" : "試合結果が登録されました。")
                //フォームを空にする
                setMatchDate("");
                setVenue("");
                setSeasonId(undefined);
                setMyTeamId(undefined);
                setAwayTeamId(undefined);
                setMyTeamScore(undefined);
                setAwayTeamScore(undefined);
                setIsMyTeamHome(true);
                setMyInnings([0,0,0,0,0,0,0]);
                setAwayInnings([0,0,0,0,0,0,0]);
                setPitcherId(undefined);
                setCatcherId(undefined);
                setWinPitcherId(undefined);
                setLossPitcherId(undefined);
                setSavePitcherId(undefined);
                setSearchParams({});

            }catch(error){
                alert(error);
            }
        }
        postMatch();

    }

    //クエリパラメータ取得
    const [searchParams,setSearchParams] = useSearchParams();
    const selectedId = searchParams.get("result_id");

    useEffect(()=>{

        if(!selectedId) {
            setSelectedMatch(undefined);
            return;     
        }

        const selectedMatchData = async()=>{
            try{
                const selectedMatchRes = await fetch(`http://localhost:8000/matches/${selectedId}`);
                
                if(!selectedMatchRes.ok){
                    throw new Error("試合情報の取得に失敗しました");
                }

                const selectedMatchResData:MatchDetail = await selectedMatchRes.json();
                setSelectedMatch(selectedMatchResData);
            }catch(error){
                alert(error);
            }
        }

        selectedMatchData();

    },[selectedId]);

    //選択された試合データをフォームの各stateに反映する
    useEffect(()=>{

        if(!selectedMatch) return;

        const myTeam = selectedMatch.teams.find((team)=>team.team_name === "アスレチックス");
        const awayTeam = selectedMatch.teams.find((team)=>team.team_name !== "アスレチックス");

        if(!myTeam || !awayTeam) return;

        //基本情報・対戦カード・最終スコア
        setMatchDate(selectedMatch.match_date);
        setVenue(selectedMatch.venue ?? "");
        setSeasonId(selectedMatch.season.id);
        setMyTeamId(myTeam.team_id);
        setAwayTeamId(awayTeam.team_id);
        setMyTeamScore(myTeam.final_score);
        setAwayTeamScore(awayTeam.final_score);
        setIsMyTeamHome(myTeam.is_home);

        //イニングスコア
        const myInningsData = selectedMatch.innings.find((team)=>team.team_name === "アスレチックス");
        const awayInningsData = selectedMatch.innings.find((team)=>team.team_name !== "アスレチックス");

        const newMyInnings = [0,0,0,0,0,0,0];
        myInningsData?.innings.forEach((inning)=>{
            newMyInnings[inning.inning_number - 1] = inning.runs;
        });
        setMyInnings(newMyInnings);

        const newAwayInnings = [0,0,0,0,0,0,0];
        awayInningsData?.innings.forEach((inning)=>{
            newAwayInnings[inning.inning_number - 1] = inning.runs;
        });
        setAwayInnings(newAwayInnings);

        //バッテリー(自チーム分のみ)
        const myBattery = selectedMatch.batteries.find((battery)=>battery.match_team_id === myTeam.id);
        if(myBattery){
            setPitcherId(myBattery.pitcher_id);
            setCatcherId(myBattery.catcher_id);
        }

        //責任投手
        const winDecision = selectedMatch.pitching_decisions.find((decision)=>decision.decision === "WIN");
        const lossDecision = selectedMatch.pitching_decisions.find((decision)=>decision.decision === "LOSS");
        const saveDecision = selectedMatch.pitching_decisions.find((decision)=>decision.decision === "SAVE");

        if(winDecision) setWinPitcherId(winDecision.player_id);
        if(lossDecision) setLossPitcherId(lossDecision.player_id);
        if(saveDecision) setSavePitcherId(saveDecision.player_id);

    },[selectedMatch]);

    //フォームクリア（新規登録ボタン）
    const clearButton = () => {
        setMatchDate("");
        setVenue("");
        setSeasonId(undefined);
        setMyTeamId(undefined);
        setAwayTeamId(undefined);
        setMyTeamScore(undefined);
        setAwayTeamScore(undefined);
        setIsMyTeamHome(true);
        setMyInnings([0,0,0,0,0,0,0]);
        setAwayInnings([0,0,0,0,0,0,0]);
        setPitcherId(undefined);
        setCatcherId(undefined);
        setWinPitcherId(undefined);
        setLossPitcherId(undefined);
        setSavePitcherId(undefined);
        setSearchParams({})
    };

    //削除ボタン(バックエンドに削除用のエンドポイントがまだ無いため未実装)
    const handleDelete = () => {
        alert("削除機能は未実装です。");
    };


    return(
        <div>
            <Title />
            <div className="grid grid-cols-[1fr_2fr] gap-14 my-10 max-w-7xl mx-auto">
                <ResultList
                    results={filterTeam}
                    setSearchTeam={setSearchTeam}
                />
                <ResultRegisterForm
                    onSubmit={handleSubmit}
                    clearButton={clearButton}
                    isEditing={!!selectedMatch}
                    deleteSubmit={handleDelete}
                    seasons={seasons}
                    teams={teams}
                    players={players}
                    matchDate={matchDate}
                    setMatchDate={setMatchDate}
                    venue={venue}
                    setVenue={setVenue}
                    seasonId={seasonId}
                    setSeasonId={setSeasonId}
                    myTeamId={myTeamId}
                    setMyTeamId={setMyTeamId}
                    awayTeamId={awayTeamId}
                    setAwayTeamId={setAwayTeamId}
                    myTeamScore={myTeamScore}
                    setMyTeamScore={setMyTeamScore}
                    awayTeamScore={awayTeamScore}
                    setAwayTeamScore={setAwayTeamScore}
                    isMyTeamHome={isMyTeamHome}
                    setIsMyTeamHome={setIsMyTeamHome}
                    myInnings={myInnings}
                    setMyInnings={setMyInnings}
                    awayInnings={awayInnings}
                    setAwayInnings={setAwayInnings}
                    pitcherId={pitcherId}
                    setPitcherId={setPitcherId}
                    catcherId={catcherId}
                    setCatcherId={setCatcherId}
                    winPitcherId={winPitcherId}
                    setWinPitcherId={setWinPitcherId}
                    lossPitcherId={lossPitcherId}
                    setLossPitcherId={setLossPitcherId}
                    savePitcherId={savePitcherId}
                    setSavePitcherId={setSavePitcherId}

                />
            </div>
        </div>
    )
};

export default ResultRegister;