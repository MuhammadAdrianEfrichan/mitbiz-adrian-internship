const Input = (props) => {
    const {
        type = 'text',
        name,
        className,
        classname,
        placeholder,
        id,
        value,
        onChange,
        required,
        autoComplete,
        minLength,
        maxLength,
    } = props;

    return (
        <input
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
            className={className || classname}
        />
    );
};

export default Input;
