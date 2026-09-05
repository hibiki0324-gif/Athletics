import playerImg from '../../assets/no-image.png'
import type { Player } from '../../types/player'
import { Link } from "react-router-dom"

type PlayerCardProps = {
    players: Player[]
}

function PlayerCard({ players }: PlayerCardProps) {
    return (
        <div className="w-full py-10">
            <div className="w-[90%] mx-auto grid grid-cols-3 gap-x-8 gap-y-8">
                {players.map((player) => (
                    <div
                        key={player.id}
                        className="border border-gray-200 shadow-sm rounded-xl w-full text-center text-xl font-medium py-4"
                    >
                        <img
                            src={player.profile_image || playerImg}
                            alt="選手写真"
                            className="w-[50%] mx-auto"
                        />
                        <p className="text-2xl pt-3 pb-1">
                            {player.uniform_number}
                        </p>
                        <p className="py-1">
                            選手
                        </p>
                        <Link to={`/players/${player.id}`}>
                            <p className="py-1">
                                {player.name}
                            </p>
                        </Link>
                        <p className="pt-1 pb-3">
                            {player.throwing_hand}投{player.batting_hand}打
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlayerCard