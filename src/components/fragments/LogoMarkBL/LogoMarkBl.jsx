import btm from '../../../assets/btm.png'

const LogoMarkBl = ()=>{
    return(
        <div className="pointer-events-none absolute -bottom-20 -left-38 h-80 w-120 overflow-hidden opacity-90">
                    <img
                        src={btm}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full -rotate-9 object-cover object-left "
                        style={{ objectPosition: "0% 50%" }}
                    />
                </div>
    )
    
}

export default LogoMarkBl