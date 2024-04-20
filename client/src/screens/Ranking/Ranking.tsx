import {Spotlight} from "../../components/ui/Spotlight";
import styles from "./Ranking.module.css"

export default function Ranking(){
    return(
        <div className={styles.ranking_container}>
            <div
                className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased relative overflow-hidden">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />
                <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                    <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Classement <br/> des potos
                    </h1>
                </div>
            </div>
        </div>
    )
}