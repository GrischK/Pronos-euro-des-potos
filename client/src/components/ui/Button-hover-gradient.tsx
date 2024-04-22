import * as React from "react";
import {MouseEventHandler, ReactNode} from "react";

interface ButtonHoverGradientProps {
    children: ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined,
}

export default function ButtonHoverGradient({children, onClick}: ButtonHoverGradientProps) {

    const BottomGradient = () => {
        return (
            <>
                <span
                    className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transform -translate-x-1/2 left-1/2 w-4/5"/>
                <span
                    className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"/>
            </>
        );
    };

    return (
        <button
            className="bg-slate-900/[0.8] relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-full h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] p-4 flex items-center justify-center gap-4"
            type="submit"
            onClick={onClick}
        >
            {children}
            <BottomGradient/>
        </button>
    )
}