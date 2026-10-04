
import { useEffect, useState } from "react";
import StatsCard,{ type StatsCardProps } from "../../components/stats/StatsCard";
import Title from "../../components/stats/Title";
import type { SeasonBattingStat, StatsRow } from "../../types/stats";
import type { Season } from "../../types/match";

function Stats(){

    const [seasons,setSeasons] = useState<Season[] | undefined>(undefined);
    const [seasonIsLoading,setSeasonIsLoading] = useState<boolean>(true);

    useEffect(()=>{

        const fetchSeason = async()=>{
            try{
                const seasonRes =await fetch(`http://localhost:8000/seasons`)

                if(!seasonRes.ok){
                    throw new Error("シーズン情報が取得できませんでした")
                }

                const seasonData: Season[] = await seasonRes.json();

                setSeasons(seasonData);
            }
            catch(error){
                alert(error)
            }
            finally{
                setSeasonIsLoading(false);
            }
        }
        fetchSeason();

    },[])

    //先頭のシーズンIDを取得
    const [seasonId,setSeasonId] = useState<number | undefined>()

    useEffect(()=>{
        if(seasons && seasons.length > 0){
            setSeasonId(seasons[0].id);
        }
    },[seasons]);

    const [stats,setStats] = useState<SeasonBattingStat[] | undefined>(undefined);
    const [isLoading,setIsLoading] = useState<boolean>(true);

    useEffect(()=>{

        if (!seasonId) return;

        const fetchStats = async()=>{

            try{
                const statsRes = await fetch(`http://localhost:8000/seasons/${seasonId}/batting-stats`)

                if(!statsRes.ok){
                    throw new Error("シーズン情報が取得できませんでした")
                }
                const statsData:SeasonBattingStat[] = await statsRes.json();
                setStats(statsData);
            }
            catch(error){
                alert(error);
            }
            finally{
                setIsLoading(false)
            }
        }
        fetchStats();

    },[seasonId]);

    if (seasonIsLoading || isLoading) {
        return <p className="text-center text-xl font-bold">読み込み中...</p>;
    }

    const plateAppearances = (stat: SeasonBattingStat) =>
        stat.at_bats + stat.walks + stat.hit_by_pitch + stat.sacrifice_bunts + stat.sacrifice_flies;

    const isQualified = (stat: SeasonBattingStat)=>
        plateAppearances(stat) >= stat.games * 2;

    const battingRanking = (
        key: keyof SeasonBattingStat,
        format: (value: number) => string = (value) => String(value),
        requireQualification: boolean = false
    ): StatsRow[] => {

        if (!stats) return [];

        const targetStats = requireQualification ? stats.filter(isQualified) : stats;

        return [...targetStats]
            .sort((a, b) => Number(b[key]) - Number(a[key]))
            .slice(0, 5)
            .map((stat, index) => ({
                rank: index + 1,
                name: stat.player_name,
                value: format(Number(stat[key])),
            }));
    };


    const statsCards: StatsCardProps[] = [
        {
            title: "打率",
            rows: battingRanking("batting_average", (v) => v.toFixed(3).replace(/^0/, ""),true),
            updatedAt: "...",
            linkText: "打率成績一覧を見る",
        },
        {
            title: "本塁打",
            rows: battingRanking("home_runs"),
            updatedAt: "...",
            linkText: "本塁打成績一覧を見る",
        },
        {
            title: "打点",
            rows: battingRanking("runs_batted_in"),
            updatedAt: "...",
            linkText: "打点成績一覧を見る",
        },
        {
            title: "安打",
            rows: battingRanking("hits"),
            updatedAt: "...",
            linkText: "安打成績一覧を見る",
        },
        {
            title: "OPS",
            rows: battingRanking("ops", (v) => v.toFixed(3).replace(/^0/, ""),true),
            updatedAt: "...",
            linkText: "OPS成績一覧を見る",
        },
        {
            title: "盗塁",
            rows: battingRanking("stolen_bases"),
            updatedAt: "...",
            linkText: "盗塁成績一覧を見る",
        },
    ];
    return(
        <div className="flex flex-col gap-8 pb-8">
            <Title />
            <p className="text-center text-3xl font-bold text-slate-900">
                打撃成績
            </p>
            <div className="grid w-full max-w-5xl grid-cols-1 gap-8 mx-auto px-4 md:grid-cols-2">
                {statsCards.map((card)=>(
                    <StatsCard key={card.title} {...card}/>
                ))}
            </div>
        </div>
    )
};

export default Stats;