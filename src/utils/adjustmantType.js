
import { FiArrowDown, FiArrowUp, FiTool } from "react-icons/fi";

export const ADJUSTMENT_TYPE_CONFIG = {
  IN: {
    label: "Tambah",
    icon: FiArrowUp,
    className: "bg-green-500",
  },
  OUT: {
    label: "Kurangi",
    icon: FiArrowDown,
    className: "bg-red-500",
  },
  CORRECTION: {
    label: "Koreksi",
    icon: FiTool,
    className: "bg-amber-500",
  },
};

export const DEFAULT_TYPE_CONFIG = {
  label: "-",
  icon: FiTool,
  className: "bg-slate-400",
};