import MainVisual from "../../components/top/MainVisual"
import News from "../../components/top/News";
import NextGame from "../../components/top/NextGame";

function Top(){
    return(
        <>
            <MainVisual />
            <div className="w-full mx-auto max-w-7xl grid grid-cols-2 gap-8 my-10">
                <News />
                <NextGame />
            </div>
        </>
    )
};

export default Top;