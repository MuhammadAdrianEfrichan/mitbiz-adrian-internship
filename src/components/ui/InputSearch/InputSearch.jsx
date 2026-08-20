import { CiSearch } from "react-icons/ci";

const InputSearch = (props)=>{
    const {placeholder, type = "text", value, onChange, className, wrapperClassName = ""}=props;
    return(
          <div className={`relative ${wrapperClassName}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
    <CiSearch className="w-5 h-5" />
    </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={className}
      />
    </div>
    )
}

export default InputSearch