import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerDetailCard from "../../components/players/PlayerDetailCard";
import type { Player } from "../../types/player";
import type { Season } from "../../types/match";
import type { SeasonBattingStat, SeasonStatsRow } from "../../types/stats";

function PlayerDetail(){
    //選手データ取得
    const { id } = useParams<{ id: string }>();
    const [player, setPlayer] = useState<Player | undefined>(undefined);

    useEffect(() => {
        const getPlayers = async()=>{
            try{
                const resPlayers = await fetch(`http://localhost:8000/players/${id}`);

                if(!resPlayers.ok){
                    const resPlayersError = await resPlayers.json();
                    throw new Error(resPlayersError.detail);
                }

                const resPlayersData:Player = await resPlayers.json();
                setPlayer(resPlayersData);

            }catch(error){
                alert(error);
            }
        }
        getPlayers();
    }, [id]);

    //シーズン情報取得（選手が変わっても内容は変わらないので最初に1回だけ取得）
    const [seasons,setSeasons] = useState<Season[] | undefined>(undefined);

    useEffect(()=>{
        const getSeasons = async()=>{
            try{
                const resSeasons = await fetch(`http://localhost:8000/seasons`);

                if(!resSeasons.ok){
                    const resSeasonsError = await resSeasons.json();
                    throw new Error(resSeasonsError.detail);
                }

                const resSeasonsData:Season[] = await resSeasons.json();
                setSeasons(resSeasonsData);

            }catch(error){
                alert(error);
            }
        }
        getSeasons();

    },[]);

    //選手成績データ取得（シーズンごとに取得→対象選手の行だけ抽出し、シーズン情報と組にする）
    const [seasonStats,setSeasonStats] = useState<SeasonStatsRow[] | undefined>(undefined);

    useEffect(()=>{
        if(!seasons) return;

        const getBattingStats = async()=>{
            try{
                const rows = await Promise.all(
                    seasons.map(async (season) => {
                        const resBattingStats = await fetch(`http://localhost:8000/seasons/${season.id}/batting-stats`);

                        if(!resBattingStats.ok){
                            throw new Error("成績の取得に失敗しました。");
                        }

                        const resBattingStatsData:SeasonBattingStat[] = await resBattingStats.json();
                        const myStat = resBattingStatsData.find((stat)=>stat.player_id === Number(id));

                        return myStat ? { season, stat: myStat } : null;
                    })
                );

                const mySeasonStats =
                    rows.filter((row): row is SeasonStatsRow => row !== null);

                setSeasonStats(mySeasonStats);

            }catch(error){
                alert(error);
            }
        }

        getBattingStats();

    },[seasons, id]);

    //今シーズン成績：年度が一番新しいシーズンの成績
    const latestSeasonStat =
        seasonStats
            ?.slice()
            .sort((a, b) => b.season.year - a.season.year)[0];

    return(
        <>
            <PlayerDetailCard
                player={player}
                seasonStats={seasonStats}
                latestSeasonStat={latestSeasonStat}
            />
        </>
    )
};

export default PlayerDetail;
