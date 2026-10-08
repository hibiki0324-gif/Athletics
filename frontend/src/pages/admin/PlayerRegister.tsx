import { useState } from "react";
import PlayerRegisterForm from "../../components/admin/players/PlayerRegisterForm";


function PlayerRegister() {

    const [inputName, setInputName] = useState<string>("");
    const [inputNumber, setInputNumber] = useState<string>("");
    const [inputThrowing, setInputThrowing] = useState<string>("");
    const [inputBatting, setInputBatting] = useState<string>("");
    const [inputImage, setInputImage] = useState<string | null>(null);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const playerData = {
            name: inputName,
            uniform_number: Number(inputNumber),
            throwing_hand: inputThrowing,
            batting_hand: inputBatting,
            profile_image: inputImage || null,
        }

        const postPlayer = async () => {
            try {
                const request = await fetch("http://localhost:8000/players", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(playerData),
                })

                if (!request.ok) {
                    const errorData = await request.json();
                    throw new Error(errorData.detail);
                }

                alert("登録完了");
                setInputName("");
                setInputNumber("");
                setInputThrowing("");
                setInputBatting("");
                setInputImage(null);

            }
            catch (error) {
                alert(error);
            }
        }
        postPlayer();
    }


    return (
        <PlayerRegisterForm
            onSubmit={handleSubmit}
            inputName={inputName} setInputName={setInputName}
            inputNumber={inputNumber} setInputNumber={setInputNumber}
            inputThrowing={inputThrowing} setInputThrowing={setInputThrowing}
            inputBatting={inputBatting} setInputBatting={setInputBatting}
            inputImage={inputImage} setInputImage={setInputImage}
        />
    )
};

export default PlayerRegister;