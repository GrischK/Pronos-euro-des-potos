import { Spotlight } from "../../components/ui/Spotlight";
import styles from "./Ranking.module.css";
import * as React from "react";

export default function Ranking() {
  return (
    <div className={styles.ranking_container}>
      <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center antialiased relative overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          <div className={styles.title_container}>
            <h1 className={styles.title}>Classement</h1>
            <h1 className={styles.title_slim}>&nbsp;des potos</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
