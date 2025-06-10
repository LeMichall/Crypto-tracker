import React, { useEffect, useState } from "react";
import styles from "./modal.module.css";

export default function Modal({ coin, onClose, darkMode }) {
  const [details, setDetails] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCloseModal = () => {
    setIsExpanded(false);
    onClose();
  };

  const getTruncatedText = (text, limit = 300) => {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };
  const fetchDetails = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false`
      );
      const data = await res.json();
      setDetails(data);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };
  useEffect(() => {
    if (!coin) return;
    fetchDetails();
    console.log(coin);
  }, [coin]);

  if (!coin || !details) return null;

  const description = details.description?.en || "No description available.";
  const homepageLinks = details.links?.homepage?.filter((link) => link);
  const sentimentUp = details.sentiment_votes_up_percentage;
  const sentimentDown = details.sentiment_votes_down_percentage;

  return (
    <div
      className={`${styles.modalOverlay} ${darkMode ? styles.dark : ""}`}
      onClick={handleCloseModal}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>
          {coin.name} ({coin.symbol.toUpperCase()})
        </h2>
        <img src={coin.image} alt={coin.name} width={50} />

        {homepageLinks?.length > 0 && (
          <div className={styles.modalSection}>
            <h3>Official Links</h3>
            <div className={styles.modalLinks}>
              {homepageLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className={styles.modalSection}>
          <h3>Community Sentiment</h3>
          <div className={styles.modalVotes}>
            <span>👍 {sentimentUp?.toFixed(1) || 0}%</span>
            <span>👎 {sentimentDown?.toFixed(1) || 0}%</span>
          </div>
        </div>
        <h3>Description</h3>
        <p>
          {isExpanded ? description : getTruncatedText(description)}

          {description.length > 300 && (
            <span
              className={styles.readToggle}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? " Read less" : " Read more"}
            </span>
          )}
        </p>
        <button onClick={handleCloseModal}>Close</button>
      </div>
    </div>
  );
}
