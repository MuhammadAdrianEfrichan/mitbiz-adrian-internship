import LogoMarkBl from "../LogoMarkBL"
import TopBarLogo from "../TopBarLogo"

const ContentLogin = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(90deg,#072C5A_0%,#0A4D93_100%)]">
            <LogoMarkBl />

            <div className="relative mx-auto min-h-screen max-w-360 px-4 sm:px-8 lg:px-10">
                <TopBarLogo />

                <div className="flex min-h-screen flex-col items-center justify-center gap-10 pb-12 pt-24 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ContentLogin;