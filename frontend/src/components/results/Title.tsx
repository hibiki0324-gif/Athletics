import player from '../../assets/resultvisual.png'

function Title(){
    return(
        <div className="relative w-full h-[400px] overflow-hidden">
            <img src={player} alt='試合結果' className='absolute inset-0 w-full h-full object-cover'/>
            <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
                <div className="flex items-baseline">
                    <h1 className="text-white text-6xl font-bold">RESULT</h1>
                    <h2 className="text-white text-3xl font-bold pl-[30px]">試合結果</h2>
                </div>
            </div>
        </div>
    )
};

export default Title;