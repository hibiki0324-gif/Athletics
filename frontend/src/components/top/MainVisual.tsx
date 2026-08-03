import main from '../../assets/mainvisual.png'

function MainVisual() {
    return (
        <div className='relative w-full h-[500px] overflow-hidden flex items-center justify-center'>
            <img src={main} alt="試合風景・チーム写真" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 bg-black/75 rounded-lg w-[65%]">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-white">
                            <th className="border-r px-6 py-4 text-left font-normal">TEAM</th>
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
                        <tr className="border-t text-white">
                            <th className="border-r px-6 py-6 text-left font-bold text-white">アスレチックス</th>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="text-center text-2xl font-bold">0</td>
                        </tr>
                        <tr className="border-t text-white">
                            <th className="border-r px-6 py-6 text-left font-bold text-white">ドルフィンズ</th>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="px-4 py-6 text-center">0</td>
                            <td className="text-center text-2xl font-bold">0</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default MainVisual;