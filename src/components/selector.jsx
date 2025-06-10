import React from "react";
import styles from "./selector.module.css";

const currencies = [
  { code: "usd", label: "USD", flag: "🇺🇸" },
  { code: "eur", label: "EUR", flag: "🇪🇺" },
  { code: "gbp", label: "GBP", flag: "🇬🇧" },
  { code: "jpy", label: "JPY", flag: "🇯🇵" },
  { code: "pln", label: "PLN", flag: "🇵🇱" },
];

export default function CurrencySelector({ value, onChange, darkMode }) {
  return (
    <div>
      <select
        className={`${styles.select} ${darkMode ? styles.dark : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.flag} {curr.label}
          </option>
        ))}
      </select>
    </div>
  );
}
