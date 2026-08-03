import player from '../../assets/playervisal.jpg'

function Title(){
    return(
        <div className="relative w-full h-[400px] overflow-hidden">
            <img src={player} alt='選手紹介' className='absolute inset-0 w-full h-full object-cover'/>
            <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
                <div className="flex items-baseline">
                    <h1 className="text-white text-6xl font-bold">PLAYER</h1>
                    <h2 className="text-white text-3xl font-bold pl-[30px]">選手紹介</h2>
                </div>
            </div>
        </div>
    )
};

export default Title;