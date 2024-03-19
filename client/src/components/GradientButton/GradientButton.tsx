import React, {ReactNode} from "react";
import styles from './GradientButton.module.css'

interface GradientButtonProps {
    children: ReactNode | string;
}

export default function GradientButton({children}: GradientButtonProps) {
    return (
        <button className={styles.gradient_button} role="button">
            {children}
        </button>
    )
}