import playerImg from '../../assets/no-image.png'

function PlayerCard(){
    return(
        <div className="w-full py-[70px]">
            <div className="w-[90%] mx-auto grid grid-cols-3 gap-x-8 ">
                <div className="w-full text-center text-xl font-medium">
                    <img src={playerImg} alt="選手写真" className="w-[60%] mx-auto"/>
                    <p className="text-2xl py-[5px]">30</p>
                    <p className="py-[5px]">監督</p>
                    <p className="py-[5px]">岡嶋英雄</p>
                    <p className="py-[5px]">右投右打</p>                
                </div>
                <div className="w-full text-center text-xl font-medium">
                    <img src={playerImg} alt="選手写真" className="w-[60%] mx-auto"/>
                    <p className="text-2xl py-[5px]">10</p>
                    <p className="py-[5px]">主将</p>
                    <p className="py-[5px]">安永健二</p>
                    <p className="py-[5px]">右投右打</p>                
                </div>
                <div className="w-full text-center text-xl font-medium">
                    <img src={playerImg} alt="選手写真" className="w-[60%] mx-auto"/>
                    <p className="text-2xl py-[5px]">6</p>
                    <p className="py-[5px]">選手</p>
                    <p className="py-[5px]">岡嶋竜也</p>
                    <p className="py-[5px]">右投右打</p>                
                </div>
            </div>
        </div>
    )
};

export default PlayerCard;