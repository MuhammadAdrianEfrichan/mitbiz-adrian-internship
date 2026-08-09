import Button from "../../ui/Button"

const ButtonLogin = ({ children = 'Next', type = 'submit', name = 'next', className = '', onClick, disabled = false, ...props }) => {
    return (
        <Button
            type={type}
            name={name}
            onClick={onClick}
            disabled={disabled}
            className={`w-full rounded-xl bg-[#0F74D7] py-3.5 text-lg font-semibold text-white transition duration-200 ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-[#0B5FB6]'} ${className}`}
            {...props}
        >
            {children}
        </Button>
    );
};

export default ButtonLogin;