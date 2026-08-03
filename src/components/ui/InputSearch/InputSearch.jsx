

const InputSearch = (props)=>{
    const {placeholder, type, icon, className}=props;
    return(
          <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
    </span>
      <input
        type={type}
        placeholder={placeholder}
        className={className}
      />
    </div>
    )
}

export default InputSearch