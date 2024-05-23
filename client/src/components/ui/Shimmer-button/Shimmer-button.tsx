import React from "react";
import styles from "./Shimmer-button.module.css";

interface ShimmerButtonProps {
  children: string;
  onClick?: () => void;
}

export function ShimmerButton({ children, onClick }: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative text-xl inline-flex h-12 items-center justify-center rounded-full border m-1 border-slate-800 bg-[linear-gradient(110deg,#0f172a,45%,#1e2631,55%,#0f172a)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-red-300 ${styles.shimmer_button}`}
    >
      {children}
    </button>
  );
}
