import { useEffect, useState } from "react";
import type { SeasonBattingStat } from "../../types/stats";
import type { Season } from "../../types/match";
import StatsDetailTable from "../../components/stats/StatsDetailTable";

function StatsDetail() {

    const [seasons, setSeasons] = useState<Season[] | undefined>(undefined);
    const [seasonIsLoading, setSeasonIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSeason = async () => {
            try {
                const seasonRes = await fetch(`http://localhost:8000/seasons`)

                if (!seasonRes.ok) {
                    throw new Error("シーズン情報が取得できませんでした");
                }

                const seasonData: Season[] = await seasonRes.json();
                setSeasons(seasonData);
            }
            catch (error) {
                alert(error);
            }
            finally {
                setSeasonIsLoading(false);
            }
        }
        fetchSeason();
    }, [])

    //selectフォームで選択したシーズンを取得
    const [selectedSeasonId, setSelectedSeasonId] = useState<number | undefined>(undefined);

    //取得後、初期状態にセレクトフォームを戻す
    useEffect(() => {
        if (seasons && seasons.length > 0) {
            setSelectedSeasonId(seasons[0].id);
        }
    }, [seasons]);

    const [stats, setStats] = useState<SeasonBattingStat[] | undefined>(undefined);
    const [statsIsLoading, setStatsIsLoading] = useState<boolean>(true);

    useEffect(()=>{

        if (!selectedSeasonId) return;

        const fetchBattingStat = async()=>{
            setStatsIsLoading(true);
            try{
                const statsRes = await fetch(`http://localhost:8000/seasons/${selectedSeasonId}/batting-stats`)

                if(!statsRes.ok){
                    throw new Error("打撃成績情報が取得できません。");
                }

                const statsData:SeasonBattingStat[] = await statsRes.json();
                setStats(statsData);
            }
            catch(error){
                alert(error);
            }
            finally{
                setStatsIsLoading(false);
            }
        }
        fetchBattingStat();
    },[selectedSeasonId]);


    return (
        <>
            <StatsDetailTable
                seasons={seasons}
                seasonIsLoading={seasonIsLoading}
                selectedSeasonId={selectedSeasonId}
                onChangeSeasonId={setSelectedSeasonId}
                stats={stats}
                statsIsLoading={statsIsLoading}
            />
        </>
    )
};

export default StatsDetail;