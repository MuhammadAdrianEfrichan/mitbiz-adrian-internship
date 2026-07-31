const Button = (props)=>{
    const {type, children, classname, name} = props;
    return(
        <button type={type} className={classname} name={name}>{children}</button>
    )
}
export default Button;