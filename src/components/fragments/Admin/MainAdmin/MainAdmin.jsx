import Button from "../../../ui/Button";

const MainAdmin = (props) => {
  const { 
    children, 
    title, 
    subtitle, 
    buttonLabel, 
    buttonClassName = "", 
    content ,
    icon,
    onClick
  } = props;

  return (
    <main className="flex-1 overflow-y-auto p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[2.1rem] font-bold tracking-tight text-slate-800">{title}</h1>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        {buttonLabel && (
          <Button className={buttonClassName} onClick={onClick}>
            {icon}{buttonLabel}
          </Button>
        )}
      </div>
      {content}
      {children}
    </main>
  );
};

export default MainAdmin;