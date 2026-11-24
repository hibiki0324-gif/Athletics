import { useEffect, useState } from "react";
import PlayerRegisterForm from "../../components/admin/players/PlayerRegisterForm";
import PlayerList from "../../components/admin/players/PlayerList";
import Title from "../../components/admin/players/Title";
import type { Player, Position } from "../../types/player";
import { useSearchParams } from "react-router-dom";


function PlayerRegister() {

    /* ポジション・選手データを取得 */
    const [positions,setPositions] = useState<Position[] | undefined>(undefined);
    const [players,setPlayers] = useState<Player[] | undefined>(undefined);
    
    useEffect(()=>{

        const getFetch = async()=>{
            try{
                const positionResponse = await fetch("http://localhost:8000/positions");
                const playerResponse = await fetch("http://localhost:8000/players");

                if(!positionResponse.ok || !playerResponse.ok){
                    throw new Error("ポジションデータの取得に失敗しました。");
                }

                const positionResponseData:Position[] = await positionResponse.json();
                const playerResponseData:Player[] = await playerResponse.json();
                setPositions(positionResponseData);
                setPlayers(playerResponseData);
            }
            catch(error){
                alert(error);
            }
        }
        getFetch();

    },[]);

    /* 選手登録(Player+Position) */
    const [inputName, setInputName] = useState<string>("");
    const [inputNumber, setInputNumber] = useState<string>("");
    const [inputThrowing, setInputThrowing] = useState<string>("");
    const [inputBatting, setInputBatting] = useState<string>("");
    const [inputImage, setInputImage] = useState<string | null>(null);
    const [inputPositions,setInputPositions] = useState<number[]>([]) ;

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const uniformNumber = Number(inputNumber);

        //背番号の整数チェック
        if(inputNumber.trim() === "" || !Number.isInteger(uniformNumber) || uniformNumber < 0){
            alert("背番号は0以上の整数で入力して下さい");
            return;
        }

        //背番号の重複チェック
        const isDuplicateNumber =
            players?.some((player) =>
                player.uniform_number === uniformNumber &&
                player.id !== selectedPlayer?.id
            );

        if (isDuplicateNumber) {
            alert("この背番号は既に使用されています。");
            return;
        }

        //選手登録データ雛形
        const playerData = {
            name: inputName,
            uniform_number: uniformNumber,
            throwing_hand: inputThrowing,
            batting_hand: inputBatting,
            profile_image: inputImage || null,
        }

        if(inputPositions.length === 0){
            alert("ポジションは1つ以上選択してください。");
            return;
        }

        const postPlayer = async () => {

            try {
                let playerId: number;

                if (selectedPlayer) {
                    /* 更新 */
                    const updateData = {
                        ...playerData,
                        is_active: selectedPlayer.is_active,
                    }

                    const playerRequest = await fetch(`http://localhost:8000/players/${selectedPlayer.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updateData),
                    })

                    if (!playerRequest.ok) {
                        const errorData = await playerRequest.json();
                        throw new Error(errorData.detail);
                    }

                    playerId = selectedPlayer.id;

                } else {
                    /* 新規登録 */
                    const playerRequest = await fetch("http://localhost:8000/players", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(playerData),
                    })

                    if (!playerRequest.ok) {
                        const errorData = await playerRequest.json();
                        throw new Error(errorData.detail);
                    }

                    const newPlayer = await playerRequest.json();
                    playerId = newPlayer.id;
                }

                /* ポジション登録は新規・更新で共通 */
                const positionRequest = await fetch(`http://localhost:8000/players/${playerId}/positions`,{
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ position_ids: inputPositions }),
                });

                if(!positionRequest.ok){
                    throw new Error("ポジションが登録できませんでした。");
                }

                await positionRequest.json();

                alert(selectedPlayer ? "更新完了" : "登録完了");
                setInputName("");
                setInputNumber("");
                setInputThrowing("");
                setInputBatting("");
                setInputPositions([]);
                setInputImage(null);
                setSearchParams({});

            }
            catch (error) {
                alert(error);
            }
        }
        postPlayer();
    }

    //クエリパラメータ取得
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedId = searchParams.get("player_id");
    const selectedPlayer = players?.find((player) => player.id === Number(selectedId));

    //クエリパラメータのvalueでフォームの値を入力
    useEffect(()=>{

        if(selectedPlayer){
            setInputName(selectedPlayer.name);
            setInputNumber(String(selectedPlayer.uniform_number));
            setInputBatting(selectedPlayer.batting_hand);
            setInputThrowing(selectedPlayer.throwing_hand);
            setInputPositions(selectedPlayer.positions.map((position) => position.id));
            setInputImage(selectedPlayer.profile_image);
        }

    },[selectedPlayer]);

    //Formクリア（新規登録ボタン）
    const clearButton = () => {
        setInputName("");
        setInputNumber("");
        setInputThrowing("");
        setInputBatting("");
        setInputPositions([]);
        setInputImage(null);
        setSearchParams({});
    }
    
    //選手名検索バーの状態管理
    const [searchPlayer,setSearchPlayer] = useState<string>("");

    const filterPlayer = 
        players?.filter((player)=>player.name.includes(searchPlayer));

    //選手登録削除(is_active=falseで論理削除)
    const handleDelete = () => {
        if(!selectedPlayer)return;
        if (!window.confirm("この選手を削除しますか？")) return;

        const deleteData = {
            name: inputName,
            uniform_number: Number(inputNumber),
            throwing_hand: inputThrowing,
            batting_hand: inputBatting,
            profile_image: inputImage || null,
            is_active:false
        }

        const deletePlayer = async() => {

            try{
                const deletePlayerRequest = await fetch(`http://localhost:8000/players/${selectedPlayer?.id}`,{
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(deleteData),
                })

                if(!deletePlayerRequest.ok){
                    throw new Error("選手情報が削除できませんでした。");
                }

                await deletePlayerRequest.json();
                alert("選手情報を削除しました。");
                setInputName("");
                setInputNumber("");
                setInputThrowing("");
                setInputBatting("");
                setInputPositions([]);
                setInputImage(null);
                setSearchParams({});

            } catch(error){
                alert(error)
            }
        };

        deletePlayer();

    }; 

    return (
        <div>
            <Title />
            <div className="grid grid-cols-2 gap-14 my-10 max-w-7xl mx-auto">
                <PlayerList 
                    players={filterPlayer}
                    setSearchPlayer={setSearchPlayer}
                />
                <PlayerRegisterForm
                    onSubmit={handleSubmit}
                    positions={positions}
                    inputName={inputName} setInputName={setInputName}
                    inputNumber={inputNumber} setInputNumber={setInputNumber}
                    inputThrowing={inputThrowing} setInputThrowing={setInputThrowing}
                    inputBatting={inputBatting} setInputBatting={setInputBatting}
                    inputPositions={inputPositions} setInputPositions={setInputPositions}
                    inputImage={inputImage} setInputImage={setInputImage}
                    clearButton={clearButton}
                    isEditing={!!selectedPlayer}
                    deleteSubmit={handleDelete}
                />
            </div>
        </div>
    )
};

export default PlayerRegister;