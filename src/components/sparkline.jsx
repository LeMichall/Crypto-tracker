import React from "react";
import styles from "./sparkline.module.css";

// NOT USED
const Sparkline = ({ data, width = 90, height = 30 }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} className={styles.sparkline}>
      <polyline
        fill="none"
        stroke={data[data.length - 1] >= data[0] ? "#4ade80" : "#f87171"}
        strokeWidth="2"
        points={points.join(" ")}
      />
    </svg>
  );
};

export default Sparkline;
