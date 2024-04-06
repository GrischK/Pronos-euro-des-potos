import React, {MouseEventHandler, ReactNode} from "react";
import styles from './GradientButton.module.css'

interface GradientButtonProps {
    children: ReactNode | string;
    type?: "submit" | "button" | "reset" | undefined;
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export default function GradientButton({children, type, onClick}: GradientButtonProps) {
    return (
        <button
            className={styles.gradient_button} role="button" {...(type ? {type: type} : {})}
            onClick={onClick}
        >
            {children}
        </button>
    )
}