import Input from "../../ui/Input"

const InputLogin = (props) => {
    const {
        type = 'text',
        name,
        id,
        placeholder,
        value,
        onChange,
        required,
        autoComplete,
        minLength,
        maxLength,
        className = '',
    } = props;

    return (
        <Input
            type={type}
            name={name}
            id={id}
            value={value}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            minLength={minLength}
            maxLength={maxLength}
            onChange={onChange}
            className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#0F74D7] focus:outline-none focus:ring-2 focus:ring-blue-100 ${className}`}
        />
    );
};

export default InputLogin;