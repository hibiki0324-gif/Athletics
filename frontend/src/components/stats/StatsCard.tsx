import { Link } from "react-router-dom";
import type { StatsRow } from "../../types/stats";

export type StatsCardProps = {
    title: string;
    rows: StatsRow[];
    updatedAt: string;
    linkText: string;
};

function StatsCard({ title, rows, updatedAt, linkText }: StatsCardProps){

    const rowElements = rows.map((row) => (
        <tr key={row.rank} className="border-b border-gray-100 last:border-0">
            <td className="w-12 py-2 text-center text-base font-bold text-gray-500">{row.rank}</td>
            <td className="w-40 py-2 pl-4 pr-8 text-base font-medium text-slate-900">{row.name}</td>
            <td className="py-2 text-left text-base font-bold text-slate-900">{row.value}</td>
        </tr>
    ));

    return(
        <div className="w-full border border-gray-200 shadow-sm bg-white px-6 py-5">
            <p className="mb-3 text-xl font-bold text-slate-900">{title}</p>
            <table className="w-full table-fixed border-collapse">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="w-12 py-2 text-center text-sm font-medium text-gray-500">順位</th>
                        <th className="w-40 py-2 pl-4 pr-8 text-left text-sm font-medium text-gray-500">選手名</th>
                        <th className="py-2 text-left text-sm font-medium text-gray-500">{title}</th>
                    </tr>
                </thead>
                <tbody>
                    {rowElements}
                </tbody>
            </table>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-400">
                <p>{updatedAt}</p>
                <Link to="#" className="text-blue-600 hover:underline">
                    {linkText}
                </Link>
            </div>
        </div>
    )
};

export default StatsCard;