import Label from "../../ui/label"
import ButtonLogin from "../ButtonLogin"
import InputLogin from "../InputLogin"

const FormLogin = ({
    children,
    variant = 'login',
    fields = [],
    values = {},
    onFieldChange,
    submitLabel = 'Next',
    footerText,
    showFooterText = true,
    onSubmit,
}) => {
    const defaultFields = [
        {
            label: 'Email',
            name: 'email',
            type: 'email',
            placeholder: 'Input your store email',
            required: true,
        },
        {
            label: 'Password',
            name: 'password',
            type: 'password',
            placeholder: 'Input your store password',
            required: true,
        },
    ];

    const fieldList = fields.length ? fields : defaultFields;

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            {fieldList.map((field) => (
                <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="mb-1 block text-base font-medium text-slate-700">
                        <span className="flex items-center gap-1">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                        </span>
                    </Label>

                    <InputLogin
                        type={field.type || 'text'}
                        name={field.name}
                        id={field.name}
                        value={values[field.name] ?? ''}
                        onChange={onFieldChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        minLength={field.minLength}
                        maxLength={field.maxLength}
                        autoComplete={field.autoComplete}
                    />
                </div>
            ))}

            {children}

            <ButtonLogin>{submitLabel}</ButtonLogin>

            {showFooterText && (
                <p className="text-center text-sm text-slate-500">
                    {footerText || 'Butuh bantuan?'}{' '}
                    <a href="#" className="text-[#0F74D7] hover:underline">
                        {variant === 'login' ? 'Hubungi admin bisnis Anda.' : 'Hubungi admin bisnis Anda.'}
                    </a>
                </p>
            )}
        </form>
    );
};

export default FormLogin