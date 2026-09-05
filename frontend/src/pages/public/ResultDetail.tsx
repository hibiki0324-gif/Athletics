import { useEffect, useState } from "react";
import ResultDetailCard from "../../components/results/ResultDetailCard";
import type { MatchDetail } from "../../types/match";
import { useParams } from "react-router-dom";

function ResultDetail(){

    const {id} = useParams<{id:string}>();
    const [result,setResult] = useState<MatchDetail | undefined>(undefined);
    const [isLoading,setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMatch = async()=>{
            try{
                const response = await fetch(`http://localhost:8000/matches/${id}`);

                if(!response.ok){
                    throw new Error("試合情報の取得に失敗しました。")
                }

                const data:MatchDetail = await response.json()
                setResult(data);
            }
            catch(error){
                alert(error);
            }
            finally{
                setIsLoading(false);
            }
        }
        fetchMatch();
    },[id])
    
    return(
        <>
            <ResultDetailCard result={result} isLoading={isLoading}/>
        </>
    )
};

export default ResultDetail;