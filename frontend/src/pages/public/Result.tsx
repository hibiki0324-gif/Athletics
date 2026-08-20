
import ResultPage from "../../components/results/ResultPage";
import ResultCard from "../../components/results/ResultCard";
import ResultFilter from "../../components/results/ResultFilter";
import Summary from "../../components/results/Summary";
import Title from "../../components/results/Title";

function Result(){

    {/* fetchでAPIを叩いて、レスポンスをJSONで受け取る */}

    return(
        <div className="flex flex-col gap-8">
            <Title />
            <Summary />
            <ResultFilter />
            <ResultCard />
            <ResultPage />
        </div>
    )
};

export default Result;
