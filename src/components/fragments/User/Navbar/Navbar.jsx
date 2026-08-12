import logo from '../../../../assets/image.png';
import { NavLink } from 'react-router-dom';
import { MdHistory } from 'react-icons/md';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { PiPackageThin } from 'react-icons/pi';
import ProfileCard from '../ProfileCard';

const menuItems = [
    { icon: LiaFileInvoiceSolid, label: 'Transaksi', to: '/transaksi-kasir' },
    { icon: PiPackageThin, label: 'Stok', to: '/stok-kasir' },
    { icon: MdHistory, label: 'Riwayat Transaksi', to: '/riwayat-transaksi-kasir' },
];

const Navbar = () => {
    return (
        <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#dfe3e8] bg-white/95 px-5 py-3 shadow-[0_1px_0_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="mx-auto flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-6">
                    <NavLink to="/dasboard-kasir" className="flex shrink-0 items-center border-r border-[#dfe3e8] pr-5">
                        <img src={logo} alt="Mitbiz logo" className="h-9 w-auto object-contain" />
                    </NavLink>

                    <ul className="flex min-w-0 items-center gap-3 text-[#1f2937]">
                        {menuItems.map(({ icon: Icon, label, to }) => (
                            <li key={label} className="min-w-0 shrink-0">
                                <NavLink
                                    to={to}
                                    className={({ isActive }) =>
                                        [
                                            'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[15px] font-medium transition-all duration-200',
                                            'whitespace-nowrap',
                                            'leading-none',
                                            isActive
                                                ? 'border-blue-200 bg-[#eef5ff] text-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.12),0_6px_18px_rgba(59,130,246,0.14)]'
                                                : 'border-transparent bg-transparent text-[#374151] hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm',
                                        ].join(' ')
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon className={isActive ? 'text-[1.3rem] text-blue-600' : 'text-[1.3rem] text-[#374151]'} />
                                            <span>{label}</span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <ProfileCard />
            </div>
        </nav>
    );
};

export default Navbar;