const Button = (props) => {
    const { type = 'button', children, classname, className, name, onClick, disabled = false, ...rest } = props;

    return (
        <button
            type={type}
            name={name}
            onClick={onClick}
            disabled={disabled}
            className={className || classname}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;