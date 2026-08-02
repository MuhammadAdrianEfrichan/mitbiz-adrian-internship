import logo from '../../../../assets/image.png';
import { MdHistory } from 'react-icons/md';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { PiPackageThin } from 'react-icons/pi';

const menuItems = [
    { icon: LiaFileInvoiceSolid, label: 'Transaksi' },
    { icon: PiPackageThin, label: 'Stok' },
    { icon: MdHistory, label: 'Riwayat Transaksi' },
];

const Navbar = () => {
    return (
        
            <nav className="w-full border-b border-[#dfe3e8] px-5 py-3 shadow-[0_1px_0_rgba(15,23,42,0.08)]">
                <div className="mx-auto flex  items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center border-r border-[#dfe3e8] pr-5">
                            <img src={logo} alt="Mitbiz logo" className="h-9 w-auto object-contain" />
                        </div>

                        <ul className="flex items-center gap-8 text-[#1f2937]">
                            {menuItems.map(({ icon: Icon, label }) => (
                                <li key={label} className="flex items-center gap-2 text-[15px] font-medium cursor-pointer">
                                    <Icon className="text-[1.3rem] text-[#374151]" />
                                    <span>{label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-2 py-1.5 shadow-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2f7] text-xs font-bold text-[#111827]">
                            D
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-[#111827]">Devon</span>
                            <span className="text-[11px] text-[#6b7280]">/Cashier</span>
                        </div>

                        <button
                            type="button"
                            aria-label="Open user menu"
                            className="ml-1 flex h-8 w-8 items-center justify-center rounded-md border border-[#dfe3e8] bg-[#f5f7fa] text-lg text-[#374151]"
                        >
                            <span className="-translate-y-px">›</span>
                        </button>
                    </div>
                </div>
            </nav>
    );
};

export default Navbar;