import logo from '../../../assets/image.png'

const TopBarLogo = ()=>{
    return(
            <div className="absolute z-10 mt-10 w-[50%]">
                <img src={logo} alt="Mitbiz" className="h-15 w-auto" />
            </div>
    )
}

export default TopBarLogo