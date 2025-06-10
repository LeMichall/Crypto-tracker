import React from "react";
import styles from "./loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.coin}>
        <div className={styles.front}>₿</div>
      </div>
      <p>Loading crypto data...</p>
    </div>
  );
};
export default Loader;
