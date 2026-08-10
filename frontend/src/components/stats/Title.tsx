import stats from '../../assets/statsvisual.png'

function Title(){
    return(
        <div className="relative w-full h-[400px] overflow-hidden">
            <img src={stats} alt='個人成績' className='absolute inset-0 w-full h-full object-cover'/>
            <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
                <div className="flex items-baseline">
                    <h1 className="text-white text-6xl font-bold">STATS</h1>
                    <h2 className="text-white text-3xl font-bold pl-[30px]">個人成績</h2>
                </div>
            </div>
        </div>
    )
};

export default Title;