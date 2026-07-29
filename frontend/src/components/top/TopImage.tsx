import main from '../../assets/main.jpg'

function TopImage(){
    return(
        <div>
            {/*ダミー画像配置*/}
            <img src={main} className='w-[100%] h-[500px]'></img>
        </div>
    )
};

export default TopImage;