import { useEffect, useState } from "react";
import PlayerCard from "../../components/players/PlayerCard";
import Title from "../../components/players/Title";
import type { Player } from "../../types/player";

function Player() {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        fetch("http://localhost:8000/players")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("選手情報の取得に失敗しました");
                }

                return response.json();
            })
            .then((data: Player[]) => {
                setPlayers(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <>
            <Title />
            <PlayerCard players={players} />
        </>
    );
}

export default Player;