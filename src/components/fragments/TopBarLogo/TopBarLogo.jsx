import logo from '../../../assets/image.png'

const TopBarLogo = (props)=>{
    const {className}= props;
    return(
            <div className="absolute z-10 mt-10 w-[50%]">
                <img src={logo} alt="Mitbiz" className="h-13 w-auto" />
            </div>
    )
}

export default TopBarLogo