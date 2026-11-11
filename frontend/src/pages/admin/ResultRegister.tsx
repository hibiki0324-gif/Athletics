import ResultRegisterForm from "../../components/admin/results/ResultRegisterForm";
import ResultList from "../../components/admin/results/ResultList";
import Title from "../../components/admin/results/Title";
import { useEffect, useState } from "react";
import { type MatchDetail, type MatchSummary, type MatchTeam } from "../../types/match";
import type { Player } from "../../types/player";
import { useSearchParams } from "react-router-dom";

function ResultRegister(){

    //ResultList用
    //試合結果一覧取得（登録・更新後にも再取得する）
    const [results,setResults] = useState<MatchSummary[] | undefined>(undefined);

    const getResults = async()=>{
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

    useEffect(()=>{
        getResults();
    },[]);

    //対戦相手検索機能
    const [searchTeam,setSearchTeam] = useState<string>("");

    const filterTeam = results?.filter((result) => {
        const opponentTeam = result.teams.find((team) => team.team_name !== "アスレチックス");
        return(
            opponentTeam?.team_name.includes(searchTeam)
        )
    });

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

    //試合結果入力フォーム用（試合自体の作成・対戦チームの決定は試合日程管理側で行う）
    const [myTeamScore,setMyTeamScore] = useState<number | undefined>(undefined);
    const [awayTeamScore,setAwayTeamScore] = useState<number | undefined>(undefined);
    const [myInnings, setMyInnings] = useState<number[]>([0,0,0,0,0,0,0]);
    const [awayInnings, setAwayInnings] = useState<number[]>([0,0,0,0,0,0,0]);
    const [pitcherId,setPitcherId] = useState<number | undefined>(undefined);
    const [catcherId,setCatcherId] = useState<number | undefined>(undefined);
    const [winPitcherId, setWinPitcherId] = useState<number | undefined>(undefined);
    const [lossPitcherId, setLossPitcherId] = useState<number | undefined>(undefined);
    const [savePitcherId, setSavePitcherId] = useState<number | undefined>(undefined);
    const [selectedMatch,setSelectedMatch] = useState<MatchDetail | undefined>(undefined);

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

        //最終スコア
        setMyTeamScore(myTeam.final_score);
        setAwayTeamScore(awayTeam.final_score);

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

    //フォームを空にする（選択解除）
    const clearButton = () => {
        setMyTeamScore(undefined);
        setAwayTeamScore(undefined);
        setMyInnings([0,0,0,0,0,0,0]);
        setAwayInnings([0,0,0,0,0,0,0]);
        setPitcherId(undefined);
        setCatcherId(undefined);
        setWinPitcherId(undefined);
        setLossPitcherId(undefined);
        setSavePitcherId(undefined);
        setSearchParams({});
    };

    //試合結果登録・更新機能（対戦チーム・シーズンは試合日程管理で確定済みのものを使う）
    const handleSubmit = (e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(!selectedMatch) return;

        const myTeam = selectedMatch.teams.find((team)=>team.team_name === "アスレチックス");
        const awayTeam = selectedMatch.teams.find((team)=>team.team_name !== "アスレチックス");

        if(!myTeam || !awayTeam) return;

        //いずれかのチームにイニングスコアが1件もなければ、まだ結果が未登録の試合（アラート文言の切り分け用）
        const hasResult = selectedMatch.innings.some((team)=>team.innings.length > 0);

        const postResult = async() => {

            try{
                //最終スコア登録（team_id・is_homeは既存のまま、スコアのみ更新）
                const matchTeamData = {
                    teams: [
                        {
                            team_id: myTeam.team_id,
                            is_home: myTeam.is_home,
                            final_score: myTeamScore
                        },
                        {
                            team_id: awayTeam.team_id,
                            is_home: awayTeam.is_home,
                            final_score: awayTeamScore
                        },
                    ],
                };

                const matchTeamRequest = await fetch(`http://localhost:8000/matches/${selectedMatch.id}/teams`,{
                    method:"PUT",
                    headers:{ "Content-Type": "application/json" },
                    body: JSON.stringify(matchTeamData),
                });

                if(!matchTeamRequest.ok){
                    const matchTeamErrorData = await matchTeamRequest.json();
                    throw new Error(matchTeamErrorData.detail);
                }

                const newMatchTeamData:MatchTeam[] = await matchTeamRequest.json();
                const myMatchTeamId = newMatchTeamData.find((team) => team.team_name === "アスレチックス")?.id;
                const awayMatchTeamId = newMatchTeamData.find((team) => team.team_name !== "アスレチックス")?.id;

                //イニングスコア登録
                const inningScoreData = {
                    teams: [
                        {
                            match_team_id: myMatchTeamId,
                            innings: myInnings.map((runs, index) => ({
                                inning_number: index + 1,
                                runs: runs,
                            })),
                        },
                        {
                            match_team_id: awayMatchTeamId,
                            innings: awayInnings.map((runs, index) => ({
                                inning_number: index + 1,
                                runs: runs,
                            })),
                        }
                    ]
                };

                const matchInningsRequest = await fetch(`http://localhost:8000/matches/${selectedMatch.id}/innings`,{
                    method:"PUT",
                    headers:{ "Content-Type": "application/json" },
                    body: JSON.stringify(inningScoreData),
                });

                if(!matchInningsRequest.ok){
                    throw new Error("イニングスコアの登録ができませんでした。")
                }

                await matchInningsRequest.json();

                //バッテリー登録（自チーム分のみ）
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

                const matchBatteryRequest = await fetch(`http://localhost:8000/matches/${selectedMatch.id}/batteries`,{
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

                const matchDecisionsRequest = await fetch(`http://localhost:8000/matches/${selectedMatch.id}/pitching-decisions`,{
                    method:"PUT",
                    headers:{ "Content-Type": "application/json" },
                    body: JSON.stringify(matchDecisionsData),
                });

                if(!matchDecisionsRequest.ok){
                    throw new Error("責任投手が記録できませんでした。")
                }

                await matchDecisionsRequest.json();
                alert(hasResult ? "試合結果を更新しました。" : "試合結果を登録しました。");

                getResults();
                clearButton();

            }catch(error){
                alert(error);
            }
        }
        postResult();

    }

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
                    selectedMatch={selectedMatch}
                    results={results}
                    players={players}
                    myTeamScore={myTeamScore}
                    setMyTeamScore={setMyTeamScore}
                    awayTeamScore={awayTeamScore}
                    setAwayTeamScore={setAwayTeamScore}
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
