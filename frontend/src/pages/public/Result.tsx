
import ResultPage from "../../components/results/ResultPage";
import ResultCard from "../../components/results/ResultCard";
import ResultFilter from "../../components/results/ResultFilter";
import Summary from "../../components/results/Summary";
import Title from "../../components/results/Title";
import type { MatchSummary } from "../../types/match";
import { useEffect, useState } from "react";

function Result(){

    const [result,setResult] =useState<MatchSummary[] | undefined>(undefined);
    const [isLoading,setIsLoading] = useState<boolean>(true);

    useEffect(()=>{

        const fetchMatch = async()=>{
            try{
                const response = await fetch(`http://localhost:8000/matches`);

                if(!response.ok){
                    throw new Error("試合情報の取得に失敗しました。");
                }

                const data:MatchSummary[] = await response.json();
                setResult(data);
            }
            catch(error){
                alert(error);
            }
            finally{
                setIsLoading(false);
            }
        };

        fetchMatch();

    },[])

    return(
        <div className="flex flex-col gap-8">
            <Title />
            <Summary />
            <ResultFilter />
            <ResultCard result={result} isLoading={isLoading}/>
            <ResultPage />
        </div>
    )
};

export default Result;
