import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerDetailCard from "../../components/players/PlayerDetailCard";
import type { Player } from "../../types/player";

function PlayerDetail(){
    const { id } = useParams<{ id: string }>();
    const [player, setPlayer] = useState<Player | undefined>(undefined);

    useEffect(() => {
        fetch(`http://localhost:8000/players/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("選手情報の取得に失敗しました");
                }
                return response.json();
            })
            .then((data: Player) => {
                setPlayer(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    return(
        <>
            <PlayerDetailCard player={player} />
        </>
    )
};

export default PlayerDetail;
