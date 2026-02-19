import styles from "./PageLoader.module.css";

export default function PageLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
      <p className={styles.text}>Loading...</p>
    </div>
  );
}
