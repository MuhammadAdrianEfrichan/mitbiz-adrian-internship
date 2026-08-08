const Button = (props) => {
    const { type = 'button', children, classname, className, name, onClick } = props;

    return (
        <button
            type={type}
            name={name}
            onClick={onClick}
            className={className || classname}
        >
            {children}
        </button>
    );
};

export default Button;