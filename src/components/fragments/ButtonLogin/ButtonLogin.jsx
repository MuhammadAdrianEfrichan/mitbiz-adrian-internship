import Button from "../../ui/Button"

const ButtonLogin = ({ children = 'Next', type = 'submit', name = 'next', className = '', onClick, ...props }) => {
    return (
        <Button
            type={type}
            name={name}
            onClick={onClick}
            className={`w-full cursor-pointer rounded-xl bg-[#0F74D7] py-3.5 text-lg font-semibold text-white transition duration-200 hover:bg-[#0B5FB6] ${className}`}
            {...props}
        >
            {children}
        </Button>
    );
};

export default ButtonLogin;