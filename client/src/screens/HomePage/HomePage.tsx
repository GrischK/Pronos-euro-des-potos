import styles from './HomePage.module.css'
import {SparklesCore} from "../../components/ui/sparkles";

export default function HomePage() {
    return (
        <div className={styles.homePage}>
            <h1 className={styles.title}>
                coucou
            </h1>
            <SparklesCore/>
        </div>
    )
}