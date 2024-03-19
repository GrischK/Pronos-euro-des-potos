import React, {ReactNode} from "react";
import styles from './GradientButton.module.css'

interface GradientButtonProps {
    children: ReactNode | string;
    type?: "submit" | "button" | "reset" | undefined
}

export default function GradientButton({children, type}: GradientButtonProps) {
    return (
        <button className={styles.gradient_button} role="button" {...(type ? {type: type} : {})}>
            {children}
        </button>
    )
}