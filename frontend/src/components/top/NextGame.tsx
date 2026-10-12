import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type MatchTeam = {
    id: number;
    team_id: number;
    team_name: string;
    is_home: boolean;
    final_score: number;
};

type Match = {
    id: number;
    season_id: number;
    match_date: string;
    start_time: string;
    venue: string | null;
    teams: MatchTeam[];
};

function NextGame() {
    const [nextMatch, setNextMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchNextMatch = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(
                    "http://localhost:8000/matches"
                );

                if (!response.ok) {
                    throw new Error("試合日程の取得に失敗しました");
                }

                const matches: Match[] = await response.json();

                // 現在日時を基準に、これから開催される試合を抽出
                const now = new Date();

                const upcomingMatches = matches
                    .filter((match) => {
                        const matchDateTime = new Date(
                            `${match.match_date}T${match.start_time}`
                        );

                        return (
                            !Number.isNaN(matchDateTime.getTime()) &&
                            matchDateTime >= now
                        );
                    })
                    .sort((a, b) => {
                        const dateA = new Date(
                            `${a.match_date}T${a.start_time}`
                        ).getTime();

                        const dateB = new Date(
                            `${b.match_date}T${b.start_time}`
                        ).getTime();

                        return dateA - dateB;
                    });

                setNextMatch(upcomingMatches[0] ?? null);
            } catch (err) {
                console.error("試合日程の取得エラー:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchNextMatch();
    }, []);

    // 日付表示用
    const formatDate = (date: string) => {
        const [year, month, day] = date.split("-").map(Number);

        return `${year}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
    };

    // 曜日表示用
    const formatWeekday = (date: string) => {
        const [year, month, day] = date.split("-").map(Number);
        const weekday = new Date(year, month - 1, day).getDay();
        const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

        return weekdays[weekday];
    };

    // 時刻表示用
    const formatTime = (time: string) => {
        return time.slice(0, 5);
    };

    // 対戦チームをホーム・ビジターに分ける
    const homeTeam = nextMatch?.teams.find((team) => team.is_home);
    const awayTeam = nextMatch?.teams.find((team) => !team.is_home);

    return (
        <div className="border border-gray-200 rounded-xl shadow-sm bg-white px-6 py-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-slate-900">
                    NEXT GAME
                    <span className="block mt-2 text-sm font-medium text-gray-500">
                        次の試合日程
                    </span>
                </p>

                <Link
                    to="/schedule"
                    className="text-sm font-medium text-gray-500 hover:underline"
                >
                    試合日程を見る
                    <span className="ml-1">&gt;</span>
                </Link>
            </div>

            {loading ? (
                <div className="py-8 text-center text-gray-500">
                    試合日程を読み込んでいます...
                </div>
            ) : error ? (
                <div className="py-8 text-center text-red-500">
                    試合日程を取得できませんでした。
                </div>
            ) : nextMatch ? (
                <div>
                    <p className="text-xl font-bold text-slate-900 py-4">
                        {formatDate(nextMatch.match_date)}

                        <span className="ml-3 text-base font-medium text-gray-600">
                            ({formatWeekday(nextMatch.match_date)})
                        </span>

                        <span className="ml-3 text-base font-medium text-gray-600">
                            {formatTime(nextMatch.start_time)}試合開始
                        </span>

                        <span className="block text-base font-medium text-gray-600">
                            {nextMatch.venue || "球場未定"}
                        </span>
                    </p>

                    <div className="flex items-center justify-center mt-6 pt-6 pb-4">
                        <p className="text-xl font-bold text-slate-900 text-center">
                            {homeTeam?.team_name ?? "未設定"}
                        </p>

                        <p className="mx-2 text-xl font-bold text-slate-900">
                            VS
                        </p>

                        <p className="text-xl font-bold text-slate-900 text-center">
                            {awayTeam?.team_name ?? "未設定"}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center text-gray-500">
                    次の試合は登録されていません
                </div>
            )}
        </div>
    );
}

export default NextGame;