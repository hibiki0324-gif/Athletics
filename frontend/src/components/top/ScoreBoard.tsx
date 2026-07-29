
function ScoreBoard(){
    return(
        <div>
            <div className="flex justify-center text-[18px]">
                <p>2026/07/29（日） VSドルフィンズ</p>
                <p className="pl-[30px]">@雁の巣レクリエーションセンター</p>
            </div>
            <div className="w-full bg-gray-200 p-[50px] mb-[50px]">
                <div className="bg-white">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-gray-400">
                                <th className="border-r border-gray-200 px-6 py-4 text-left font-normal">TEAM</th>
                                <th className="px-4 py-4 font-normal">1</th>
                                <th className="px-4 py-4 font-normal">2</th>
                                <th className="px-4 py-4 font-normal">3</th>
                                <th className="px-4 py-4 font-normal">4</th>
                                <th className="px-4 py-4 font-normal">5</th>
                                <th className="px-4 py-4 font-normal">6</th>
                                <th className="px-4 py-4 font-normal">7</th>
                                <th className="px-4 py-4 font-normal">R</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-gray-100">
                                <th className="border-r border-gray-200 px-6 py-6 text-left font-bold"></th>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="text-center text-2xl font-bold"></td>
                            </tr>
                            <tr className="border-t border-gray-100">
                                <th className="border-r border-gray-200 px-6 py-6 text-left font-bold"></th>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="px-4 py-6"></td>
                                <td className="text-center text-2xl font-bold"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default ScoreBoard;
