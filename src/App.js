import React, { useState, useEffect } from "react";
import styles from "./app.module.css";
import Modal from "./components/modal";
import { formatCurrency } from "./utils/formatter";
import useDarkMode from "./hooks/useDarkMode";
import CurrencySelector from "./components/selector";
import Loader from "./components/loader";

export default function App() {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "usd";
  });
  const [darkMode, toggleDarkMode] = useDarkMode(() => {
    return localStorage.getItem("darkMode") === true;
  });
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchCoins = async () => {
    setLoading(true);
    console.log("fetched");
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=${page}&sparkline=true`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setCoins(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };
  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (typeof valA === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }
  });
  useEffect(() => {
    fetchCoins();

    const interval = setInterval(fetchCoins, 600000);
    return () => clearInterval(interval);
  }, [currency, page]);
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          key,
          direction: "asc",
        };
      }
    });
  };
  const filteredCoins = sortedCoins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${styles.App} ${darkMode ? styles.dark : ""}`}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Crypto Price Tracker</h1>
        </div>
        <CurrencySelector
          value={currency}
          onChange={setCurrency}
          darkMode={darkMode}
        />
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <input
        type="text"
        value={searchQuery}
        placeholder="Search for coin"
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      {loading && <Loader />}
      {error && (
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
          <button className={styles.retryButton} onClick={fetchCoins}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Coin
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("current_price")}>
                  Price (USD)
                  {sortConfig.key === "current_price" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("price_change_percentage_24h")}>
                  24h Change
                  {sortConfig.key === "price_change_percentage_24h" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("market_cap")}>
                  Market Cap
                  {sortConfig.key === "market_cap" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr key={coin.id}>
                  <td
                    onClick={() => setSelectedCoin(coin)}
                    className={styles.cryptoIcon}
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      width="25"
                      className={styles.coinImage}
                    />
                    {coin.name}
                  </td>
                  <td>{formatCurrency(coin.current_price, currency)}</td>
                  <td
                    className={
                      coin.price_change_percentage_24h >= 0
                        ? styles.green
                        : styles.red
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>{formatCurrency(coin.market_cap, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              {"<"}
            </button>
            <span className={styles.paginationPage}>{page}</span>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage((prev) => prev + 1)}
            >
              {">"}
            </button>
          </div>
        </div>
      )}

      <Modal
        coin={selectedCoin}
        onClose={() => setSelectedCoin(null)}
        darkMode={darkMode}
        currency={currency}
      />
    </div>
  );
}
