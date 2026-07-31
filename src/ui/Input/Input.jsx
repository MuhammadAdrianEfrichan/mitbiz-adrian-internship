const Input = (props)=>{
    const {type, name, classname, placeholder, id}=props;
    return(
        <input type={type} name={name} className={classname} placeholder={placeholder} id={id} />
    )
}

export default Input
