import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'


function Header(){
    return(
        <div className='sticky top-0 z-50 bg-white'>
            <div className='grid grid-cols-3 items-center'>
                <div></div>
                <div className="flex justify-center mt-[10px]">
                    <img src={logo} alt='チームlogo' className='w-[20%] h-auto' />
                </div>
                <div className="flex justify-end pr-[50px]">
                    <button>ログイン</button>
                </div>
            </div>
            <div className='mt-[35px] mb-[30px]'>
                <ul className='grid grid-cols-4 items-center'>
                    <li className="font-medium">
                        <Link to="/" className="flex flex-col items-center text-xl">
                            トップページ
                            <span className="text-sm">TOP</span>
                        </Link>
                    </li>
                    <li className="font-medium">
                        <Link to="/players" className="flex flex-col items-center text-xl">
                            選手紹介
                            <span className="text-sm">PLAYER</span>
                        </Link>
                    </li>
                    <li className="font-medium">
                        <Link to="results" className="flex flex-col items-center text-xl">
                            試合結果
                            <span className="text-sm">RESULT</span>
                        </Link>
                    </li>
                    <li className="font-medium">
                        <a href="#" className="flex flex-col items-center text-xl">
                            個人成績
                            <span className="text-sm">STATS</span>
                        </a>
                    </li>
                </ul>

            </div>
        </div>
    )
};

export default Header;