import StatsCard,{ type StatsCardProps } from "../../components/stats/StatsCard";
import Title from "../../components/stats/Title";

function Stats(){

    {/* ダミーデータ作成 */}
    const statsCards: StatsCardProps[] = [
        {
            title: "打率",
            rows: [
                { rank: 1, name: "今村 響", value: ".368" },
                { rank: 2, name: "田原 颯太", value: ".324" },
                { rank: 3, name: "岡嶋 竜也", value: ".316" },
                { rank: 4, name: "池田 泰生", value: ".311" },
                { rank: 5, name: "松枝 龍平", value: ".309" },
            ],
            updatedAt: "2026/7/22 22:21 更新",
            linkText: "打率成績一覧を見る",
        },
        {
            title: "本塁打",
            rows: [
                { rank: 1, name: "今村 響", value: ".368" },
                { rank: 2, name: "田原 颯太", value: ".324" },
                { rank: 3, name: "岡嶋 竜也", value: ".316" },
                { rank: 4, name: "池田 泰生", value: ".311" },
                { rank: 5, name: "松枝 龍平", value: ".309" },
            ],
            updatedAt: "2026/7/22 22:21 更新",
            linkText: "本塁打成績一覧を見る",
        },
        {
            title: "打点",
            rows: [
                { rank: 1, name: "今村 響", value: ".368" },
                { rank: 2, name: "田原 颯太", value: ".324" },
                { rank: 3, name: "岡嶋 竜也", value: ".316" },
                { rank: 4, name: "池田 泰生", value: ".311" },
                { rank: 5, name: "松枝 龍平", value: ".309" },
            ],
            updatedAt: "2026/7/22 22:21 更新",
            linkText: "打点成績一覧を見る",
        },
        {
            title: "安打",
            rows: [
                { rank: 1, name: "今村 響", value: ".368" },
                { rank: 2, name: "田原 颯太", value: ".324" },
                { rank: 3, name: "岡嶋 竜也", value: ".316" },
                { rank: 4, name: "池田 泰生", value: ".311" },
                { rank: 5, name: "松枝 龍平", value: ".309" },
            ],
            updatedAt: "2026/7/22 22:21 更新",
            linkText: "安打成績一覧を見る",
        },
        {
            title: "OPS",
            rows: [
                { rank: 1, name: "今村 響", value: ".368" },
                { rank: 2, name: "田原 颯太", value: ".324" },
                { rank: 3, name: "岡嶋 竜也", value: ".316" },
                { rank: 4, name: "池田 泰生", value: ".311" },
                { rank: 5, name: "松枝 龍平", value: ".309" },
            ],
            updatedAt: "2026/7/22 22:21 更新",
            linkText: "OPS成績一覧を見る",
        },
        {
            title: "盗塁",
            rows: [
                { rank: 1, name: "今村 響", value: ".368" },
                { rank: 2, name: "田原 颯太", value: ".324" },
                { rank: 3, name: "岡嶋 竜也", value: ".316" },
                { rank: 4, name: "池田 泰生", value: ".311" },
                { rank: 5, name: "松枝 龍平", value: ".309" },
            ],
            updatedAt: "2026/7/22 22:21 更新",
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
                {statsCards.map((card) => (
                    <StatsCard key={card.title} {...card} />
                ))}
            </div>
        </div>
    )
};

export default Stats;