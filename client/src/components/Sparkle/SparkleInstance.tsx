import styles from "./SparkleInstance.module.css";

export interface SparkleProps {
  color: string;
  size: number;
  style: any;
}

export default function SparkleInstance({ color, size, style }: SparkleProps) {
  return (
    <div className={styles.sparkle_wrapper} style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
        viewBox="0 0 200 200"
        className={styles.sparkle}
      >
        <path
          fill={color}
          d="M100 0s5.518 51.5 27.009 72.99C148.501 94.484 200 100 200 100s-51.499 5.518-72.991 27.009C105.518 148.501 100 200 100 200s-5.517-51.499-27.01-72.991C51.5 105.518 0 100 0 100s51.5-5.517 72.99-27.01C94.484 51.5 100 0 100 0z"
        ></path>
      </svg>
    </div>
  );
}
