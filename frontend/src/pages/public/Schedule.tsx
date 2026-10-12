import { useEffect, useMemo, useState } from "react";

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
    start_time: string | null;
    venue: string | null;
    teams: MatchTeam[];
};

function Schedule() {
    // アクセスした当日の年を初期選択年にする
    const currentYear = new Date().getFullYear();

    const [selectedYear, setSelectedYear] = useState(
        String(currentYear),
    );
    const [matches, setMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // APIから試合日程を取得
    useEffect(() => {
        const controller = new AbortController();

        async function fetchMatches() {
            setIsLoading(true);
            setError("");

            try {
                const response = await fetch(
                    "http://localhost:8000/matches",
                    { signal: controller.signal },
                );

                if (!response.ok) {
                    throw new Error("試合日程の取得に失敗しました。");
                }

                const data: Match[] = await response.json();

                setMatches(data);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                setError(
                    "試合日程を取得できませんでした。時間をおいて再度お試しください。",
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchMatches();

        return () => controller.abort();
    }, []);

    // DBの試合データから年を抽出し、選択肢を動的に作成
    // 現在の年も含めることで、当年に試合がない場合にも選択できる
    const availableYears = useMemo(() => {
        const years = new Set<number>([currentYear]);

        matches.forEach((match) => {
            const year = Number(match.match_date.slice(0, 4));

            if (Number.isInteger(year) && year > 0) {
                years.add(year);
            }
        });

        return Array.from(years)
            .sort((a, b) => b - a)
            .map(String);
    }, [matches, currentYear]);

    // 選択された年の試合を抽出して日付順に並べる
    const yearlyMatches = useMemo(() => {
        return matches
            .filter(
                (match) =>
                    match.match_date.slice(0, 4) === selectedYear,
            )
            .sort((a, b) =>
                b.match_date.localeCompare(a.match_date),
            );
    }, [matches, selectedYear]);

    // 年内の試合を年月ごとにグループ化
    const monthlyMatches = useMemo(() => {
        const groups = new Map<string, Match[]>();

        yearlyMatches.forEach((match) => {
            const yearMonth = match.match_date.slice(0, 7);

            if (!groups.has(yearMonth)) {
                groups.set(yearMonth, []);
            }

            groups.get(yearMonth)!.push(match);
        });

        // 年月も新しい順に並べる
        return Array.from(groups.entries()).sort(([a], [b]) =>
            b.localeCompare(a),
        );
    }, [yearlyMatches]);

    // 日付から日本語の曜日を取得
    const getDayOfWeek = (dateString: string) => {
        const date = new Date(`${dateString}T00:00:00`);

        return new Intl.DateTimeFormat("ja-JP", {
            weekday: "short",
        }).format(date);
    };

    // 日付を「10月18日（日）」形式に変換
    const formatMatchDate = (dateString: string) => {
        const [, month, day] = dateString.split("-");

        return `${Number(month)}月${Number(day)}日（${getDayOfWeek(dateString)}）`;
    };

    // 年月を「2026年10月」形式に変換
    const formatYearMonth = (yearMonth: string) => {
        const [year, month] = yearMonth.split("-");

        return `${Number(year)}年${Number(month)}月`;
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {/* ページタイトル */}
            <section className="mb-8">
                <h1 className="text-3xl font-bold tracking-wide text-slate-900">
                    試合日程
                </h1>

                <p className="mt-2 text-sm font-semibold tracking-widest text-slate-500">
                    GAME SCHEDULE
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                    アスレチックスの試合予定を確認できます。
                </p>
            </section>

            {/* 試合予定一覧 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                {/* 見出し・年選択 */}
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            試合予定一覧
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            年ごとの試合スケジュール
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="schedule-year"
                            className="shrink-0 text-sm font-semibold text-slate-700"
                        >
                            表示する年
                        </label>

                        <select
                            id="schedule-year"
                            value={selectedYear}
                            onChange={(event) =>
                                setSelectedYear(event.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:w-36"
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}年
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 試合日程の表示領域 */}
                <div className="mt-6">
                    {isLoading ? (
                        <div className="flex min-h-56 items-center justify-center text-sm text-slate-500">
                            試合日程を読み込んでいます...
                        </div>
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700"
                        >
                            {error}
                        </div>
                    ) : monthlyMatches.length === 0 ? (
                        <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-10 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                >
                                    <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="16"
                                        rx="2"
                                    />
                                    <path d="M16 3v4M8 3v4M3 10h18" />
                                </svg>
                            </div>

                            <p className="font-semibold text-slate-700">
                                {selectedYear}年の試合日程
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                この年の試合日程はありません。
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {monthlyMatches.map(
                                ([yearMonth, monthMatches]) => (
                                    <section
                                        key={yearMonth}
                                        aria-label={formatYearMonth(yearMonth)}
                                    >
                                        {/* 月別見出し */}
                                        <div className="mb-4 border-b-2 border-slate-200 pb-3">
                                            <h3 className="text-xl font-bold tracking-wide text-slate-900">
                                                {formatYearMonth(yearMonth)}
                                            </h3>
                                        </div>

                                        {/* 月ごとの試合カード */}
                                        <div className="space-y-4">
                                            {monthMatches.map((match) => {
                                                const homeTeam =
                                                    match.teams.find(
                                                        (team) =>
                                                            team.is_home,
                                                    );

                                                const awayTeam =
                                                    match.teams.find(
                                                        (team) =>
                                                            !team.is_home,
                                                    );

                                                return (
                                                    <article
                                                        key={match.id}
                                                        className="rounded-xl border border-slate-200 p-5 transition hover:border-slate-400 sm:p-6"
                                                    >
                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="min-w-0">
                                                                {/* 試合日・開始時刻 */}
                                                                <p className="text-sm font-semibold text-slate-500">
                                                                    {formatMatchDate(
                                                                        match.match_date,
                                                                    )}
                                                                    <span className="mx-2">
                                                                        |
                                                                    </span>
                                                                    {match.start_time
                                                                        ? match.start_time.slice(
                                                                              0,
                                                                              5,
                                                                          )
                                                                        : "時間未定"}
                                                                </p>

                                                                {/* 対戦カード */}
                                                                <h4 className="mt-2 text-lg font-bold leading-relaxed text-slate-900">
                                                                    {homeTeam?.team_name ??
                                                                        "ホーム未定"}

                                                                    <span className="mx-2 text-slate-400">
                                                                        vs
                                                                    </span>

                                                                    {awayTeam?.team_name ??
                                                                        "ビジター未定"}
                                                                </h4>

                                                                {/* 球場 */}
                                                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.7"
                                                                        className="h-4 w-4 shrink-0"
                                                                        aria-hidden="true"
                                                                    >
                                                                        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                                                                        <circle
                                                                            cx="12"
                                                                            cy="10"
                                                                            r="2.5"
                                                                        />
                                                                    </svg>

                                                                    <span>
                                                                        {match.venue ||
                                                                            "球場未定"}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* 試合ステータス */}
                                                            <span className="inline-flex w-fit shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                                                試合予定
                                                            </span>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Schedule;