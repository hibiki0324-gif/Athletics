import { useEffect, useState } from "react";
import StatsList from "../../components/admin/stats/StatsList";
import StatsRegisterForm from "../../components/admin/stats/StatsRegisterForm";
import Title from "../../components/admin/stats/Title";
import type { MatchSummary } from "../../types/match";
import type { Player, Position } from "../../types/player";
import type { BattingStatRow, LineupRow, MatchBattingStatResponse, MatchLineupResponse } from "../../types/stats";
import { useSearchParams } from "react-router-dom";

function StatsRegister() {

    //試合結果/選手/ポジション一覧取得
    const [results, setResults] = useState<MatchSummary[] | undefined>(undefined);
    const [players, setPlayers] = useState<Player[] | undefined>(undefined);
    const [positions, setPositions] = useState<Position[] | undefined>(undefined);

    useEffect(() => {

        const getFetch = async () => {
            try {
                const resResults = await fetch(`http://localhost:8000/matches`);
                const resPlayers = await fetch(`http://localhost:8000/players`);
                const resPositions = await fetch(`http://localhost:8000/positions`);

                if (!resResults.ok || !resPlayers.ok || !resPositions.ok) {
                    throw new Error("試合情報を取得できませんでした。");
                }

                const resResultsData: MatchSummary[] = await resResults.json();
                const resPlayersData: Player[] = await resPlayers.json();
                const resPositionsData: Position[] = await resPositions.json();
                setResults(resResultsData);
                setPlayers(resPlayersData);
                setPositions(resPositionsData);

            } catch (error) {
                alert(error);
            }
        }
        getFetch();

    }, []);

    //試合検索バー機能
    const [searchTeam, setSearchTeam] = useState<string>("");

    const filterTeam = results?.filter((result) => {
        const opponentTeam = result?.teams.find((team) => team.team_name !== "アスレチックス");
        return (
            opponentTeam?.team_name.includes(searchTeam)
        );
    });

    //出場選手登録機能
    const [lineupRow, setLineupRow] = useState<LineupRow[] | undefined>(undefined);
    const [battingOrder, setBattingOrder] = useState<number>();
    const [playerId, setPlayerId] = useState<number | undefined>(undefined);
    const [positionId, setPositionId] = useState<number | undefined>(undefined);
    const [isStarter, setIsStarter] = useState<boolean>(true);
    const [entryInning, setEntryInning] = useState<number>();
    const [exitInning, setExitInning] = useState<number | undefined>(undefined);

    //entry_sequenceの自動計算（削除後も重複しないよう、現在の最大値+1で計算）
    const nextEntrySequence =
        lineupRow && lineupRow.length > 0
            ? Math.max(...lineupRow.map((row) => row.entry_sequence)) + 1 : 1;

    //lineupフォームの値を受け取り
    const lineupRowData: LineupRow = {
        batting_order: battingOrder,
        entry_sequence: nextEntrySequence,
        player_id: playerId,
        position_id: positionId,
        is_starter: isStarter,
        entry_inning: entryInning,
        exit_inning: exitInning ?? null,
    };

    //+打順追加ボタンイベント（重複チェック→前の行のexit_inningを閉じる→行を追加→フォームを空にする）
    const createRow = () => {
        //必須チェック：空のまま行を追加できないようにする（+打順を追加はtype="button"のためHTMLのrequiredが効かない）
        if (
            battingOrder === undefined ||
            playerId === undefined ||
            positionId === undefined ||
            entryInning === undefined
        ) {
            alert("打順・選手・守備・出場回は必須です。");
            return;
        }

        //範囲チェック
        if (battingOrder < 1 || battingOrder > 10) {
            alert("打順は1〜10の範囲で入力して下さい。");
            return;
        }

        if (entryInning < 1 || entryInning > 7) {
            alert("出場回は1〜7の範囲で入力して下さい。");
            return;
        }

        //重複チェック：同じ選手が別の打順で既に出場中（exit_inning未設定）の場合は追加しない
        const isActiveElsewhere =
            lineupRow?.some((row) =>
                row.player_id === playerId &&
                row.exit_inning === null &&
                row.batting_order !== battingOrder
            );

        if (isActiveElsewhere) {
            alert("この選手は既に別の打順で出場中です。");
            return;
        }

        //重複チェック：一度退場済み（exit_inningに値あり）の選手は再登録できない
        const isAlreadyExited =
            lineupRow?.some((row) =>
                row.player_id === playerId &&
                row.exit_inning !== null
            );

        if (isAlreadyExited) {
            alert("この選手は既に退場済みのため再登録できません。");
            return;
        }

        //同じ打順で出場中（exit_inning未設定）の行があれば、新しい行のentry_inningで退場回を自動で閉じる
        const closedLineupRow =
            (lineupRow ?? []).map((row) => {
                if (row.batting_order === battingOrder && row.exit_inning === null) {
                    return { ...row, exit_inning: entryInning ?? null };
                }
                return row;
            });

        setLineupRow([...closedLineupRow, lineupRowData]);
        setBattingOrder(undefined);
        setPlayerId(undefined);
        setPositionId(undefined);
        setIsStarter(true);
        setEntryInning(undefined);
        setExitInning(undefined);
    }

    //行削除ボタンイベント
    const deleteRow = (index: number) => {
        setLineupRow(lineupRow?.filter((_, i) => i !== index));
    }

    const [searchParams, setSearchParams] = useSearchParams();
    const selectedId = searchParams.get("result_id");
    const selectedResultId = results?.find((result) => result.id === Number(selectedId));
    const matchTeamId = selectedResultId?.teams.find((team) => team.team_name === "アスレチックス")?.id;

    //selectedIdが変わると空or既存データ読み込み
    useEffect(() => {
        setLineupRow([]);
        setBattingOrder(undefined);
        setPlayerId(undefined);
        setPositionId(undefined);
        setIsStarter(true);
        setEntryInning(undefined);
        setExitInning(undefined);

        if (!selectedId) return;

        const getLineupRow = async () => {

            try {
                const resLineup = await fetch(`http://localhost:8000/matches/${selectedId}/lineup`);

                if (!resLineup.ok) {
                    const lineupErrorData = await resLineup.json();
                    throw new Error(lineupErrorData.detail)
                }

                const resLineupData: MatchLineupResponse[] = await resLineup.json();

                const myTeamLineup =
                    resLineupData?.find((team) => team.match_team_id === matchTeamId);

                const convertedRow: LineupRow[] =
                    (myTeamLineup?.entries ?? []).map((entry) => (
                        {
                            batting_order: entry.batting_order,
                            entry_sequence: entry.entry_sequence,
                            player_id: entry.player_id,
                            position_id: entry.position_id,
                            is_starter: entry.is_starter,
                            entry_inning: entry.entry_inning,
                            exit_inning: entry.exit_inning,
                        }
                    ));

                setLineupRow(convertedRow);

            } catch (error) {
                alert(error);
            }
        };

        getLineupRow();

    }, [selectedId]);

    const LineupData = {
        match_team_id: matchTeamId,
        entries: lineupRow ?? []
    };

    //スタメン登録
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const putFetch = async () => {
            try {
                const lineupRequest = await fetch(`http://localhost:8000/matches/${selectedId}/lineup`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(LineupData),
                });

                if (!lineupRequest.ok) {
                    const errorData = await lineupRequest.json();
                    throw new Error(errorData.detail)
                }

                await lineupRequest.json();
                alert("スタメン登録が完了しました。")

            } catch (error) {
                alert(error);
            }
        };

        putFetch();
    };

    /* ------------------------------------------------------------------------------------------------------------------- */
    //打撃成績登録
    const [matchBattingStat, setMatchBattingStat] = useState<BattingStatRow[] | undefined>([]);
    const [savedBattingStats, setSavedBattingStats] = useState<MatchBattingStatResponse[]>([]);

    //lineupRowからplayer_idを取得
    const battingStatsPlayers =
        lineupRow?.map((row) => row.player_id);

    //重複しているidを外して、playerIdを抽出
    const uniquePlayers =
        [...new Set(battingStatsPlayers)].filter((id): id is number => id !== undefined);

    //打撃成績の初期データ登録（0埋め）
    const initBattingStats = uniquePlayers.map((playerId) => ({
        player_id: playerId,
        at_bats: 0,
        hits: 0,
        doubles: 0,
        triples: 0,
        home_runs: 0,
        runs_batted_in: 0,
        walks: 0,
        hit_by_pitch: 0,
        sacrifice_bunts: 0,
        sacrifice_flies: 0,
        strikeouts: 0,
        stolen_bases: 0,
    }));

    //試合（selectedId）が変わった時だけ、保存済みの打撃成績を取得する
    useEffect(() => {
        setSavedBattingStats([]);
        if (!selectedId) return;

        const getBattingFetch = async () => {
            try {
                const battingStatRes = await fetch(`http://localhost:8000/matches/${selectedId}/batting-stats`);

                if (!battingStatRes.ok) {
                    throw new Error("成績が取得できませんでした。");
                }

                const getBattingStatResData: MatchBattingStatResponse[] = await battingStatRes.json();
                setSavedBattingStats(getBattingStatResData);

            } catch (error) {
                alert(error);
            }
        };

        getBattingFetch();

    }, [selectedId]);

    //出場選手（lineupRow）の変化に合わせてmatchBattingStatを同期する
    //・入力済みの選手はそのまま維持（編集中の値を消さない）
    //・新規に追加された選手は保存済みデータ、無ければ0埋めを追加
    //・出場から外れた選手はリストから除外
    useEffect(() => {
        setMatchBattingStat((prev) => {
            const prevRows = prev ?? [];

            return initBattingStats.map((zeroRow) => {
                const existingRow =
                    prevRows.find((row) => row.player_id === zeroRow.player_id);

                if (existingRow) return existingRow;

                const savedStat =
                    savedBattingStats.find((stat) =>
                        stat.match_team_id === matchTeamId &&
                        stat.player_id === zeroRow.player_id
                    );

                if (!savedStat) return zeroRow;

                return {
                    player_id: savedStat.player_id,
                    at_bats: savedStat.at_bats,
                    hits: savedStat.hits,
                    doubles: savedStat.doubles,
                    triples: savedStat.triples,
                    home_runs: savedStat.home_runs,
                    runs_batted_in: savedStat.runs_batted_in,
                    walks: savedStat.walks,
                    hit_by_pitch: savedStat.hit_by_pitch,
                    sacrifice_bunts: savedStat.sacrifice_bunts,
                    sacrifice_flies: savedStat.sacrifice_flies,
                    strikeouts: savedStat.strikeouts,
                    stolen_bases: savedStat.stolen_bases,
                };
            });
        });
    }, [lineupRow, savedBattingStats])

    //打撃成績の各入力欄のonChangeから呼ぶ更新関数（対象選手の該当項目だけ書き換える）
    const updateBattingStat = (
        playerId: number,
        field: keyof BattingStatRow,
        value: number
    ) => {
        setMatchBattingStat((prev) =>
            prev?.map((row) =>
                row.player_id === playerId ? { ...row, [field]: value } : row
            )
        );
    };

    //打撃成績API送信用雛形
    const battingStatData = {
        match_team_id: matchTeamId,
        stats: matchBattingStat ?? []
    };

    //打撃成績登録処理
    const handleBattingSubmit = (e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault()

        //ドメインチェック（バックエンドのmodel_validatorと同内容を事前にフロントでもチェックする）
        for (const stat of matchBattingStat ?? []) {
            const playerName = players?.find((player) => player.id === stat.player_id)?.name ?? "選手";

            if (stat.hits > stat.at_bats) {
                alert(`${playerName}：安打数は打数を超えることができません。`);
                return;
            }

            if (stat.doubles + stat.triples + stat.home_runs > stat.hits) {
                alert(`${playerName}：二塁打、三塁打、本塁打の合計は安打数を超えることができません。`);
                return;
            }

            if (stat.strikeouts > stat.at_bats) {
                alert(`${playerName}：三振数は打数を超えることができません。`);
                return;
            }
        }

        const statPutFetch = async() => {
            try{
                const battingStatRequest = await fetch(`http://localhost:8000/matches/${selectedId}/batting-stats`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(battingStatData),
                });

                if (!battingStatRequest.ok){
                    const battingStatErrorData = await battingStatRequest.json();
                    throw new Error(battingStatErrorData.detail);
                }

                await battingStatRequest.json();
                alert("打撃成績の登録が完了しました。");
                setSearchParams("");
                
            }catch(error){
                alert(error);
            }
        }
        statPutFetch();
    };

    return (
        <div>
            <Title />
            <div className="grid grid-cols-[1fr_2fr] gap-14 my-10 max-w-7xl mx-auto">
                <StatsList
                    results={filterTeam}
                    setSearchTeam={setSearchTeam}
                />
                <StatsRegisterForm
                    results={results}
                    players={players}
                    positions={positions}
                    battingOrder={battingOrder}
                    lineupRow={lineupRow}
                    setBattingOrder={setBattingOrder}
                    playerId={playerId}
                    setPlayerId={setPlayerId}
                    positionId={positionId}
                    setPositionId={setPositionId}
                    isStarter={isStarter}
                    setIsStarter={setIsStarter}
                    entryInning={entryInning}
                    setEntryInning={setEntryInning}
                    exitInning={exitInning}
                    setExitInning={setExitInning}
                    createRow={createRow}
                    deleteRow={deleteRow}
                    onSubmit={handleSubmit}
                    matchBattingStat={matchBattingStat}
                    updateBattingStat={updateBattingStat}
                    handleBattingSubmit={handleBattingSubmit}
                />
            </div>
        </div>
    )
}

export default StatsRegister;