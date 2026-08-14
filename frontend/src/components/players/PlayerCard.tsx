import playerImg from '../../assets/no-image.png'
import type { Player } from '../../types/player'

type PlayerCardProps = {
    players: Player[]
}

function PlayerCard({ players }: PlayerCardProps) {
    return (
        <div className="w-full py-[70px]">
            <div className="w-[90%] mx-auto grid grid-cols-3 gap-x-8">
                {players.map((player) => (
                    <div
                        key={player.id}
                        className="w-full text-center text-xl font-medium"
                    >
                        <img
                            src={player.profile_image || playerImg}
                            alt="選手写真"
                            className="w-[60%] mx-auto"
                        />

                        <p className="text-2xl py-[5px]">
                            {player.uniform_number}
                        </p>

                        <p className="py-[5px]">
                            選手
                        </p>

                        <p className="py-[5px]">
                            {player.name}
                        </p>

                        <p className="py-[5px]">
                            {player.throwing_hand}投{player.batting_hand}打
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlayerCard