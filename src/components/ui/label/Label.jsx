const Label = (props)=>{
    const {children, htmlFor, className} = props;
    return(
        <label htmlFor={htmlFor} className="mb-1.5 block text-2xl font-medium text-gray-700">{children}</label>
    )
}

export default Label