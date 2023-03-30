import React, { useEffect } from "react";
import useAPI from "../../../hooks/useAPI";

import styles from "./Banner.module.css";

const Banner = () => {
  // nhận các biến từ custom hook
  const { enteredBanner, isLoading, errorBanner, fetchMovies } = useAPI();

  // gọi fetchAPI bên custom hook.
  useEffect(() => {
    fetchMovies("fetchNetflixOriginals");
  }, [fetchMovies]);

  // xét điều kiện để render hợp lý với dữ liệu trả về từ custom hook
  if (isLoading) {
    return <p className={styles.reject}>Loading...</p>;
  }

  if (errorBanner) {
    return <p className={styles.reject}>{errorBanner}</p>;
  }

  if (enteredBanner) {
    return (
      <div
        className={styles.nav}
        style={{ backgroundImage: `url(${enteredBanner.backdrop})` }}
      >
        <div className={styles.movieBanner}>
          <h1>{enteredBanner.title}</h1>
          <nav>
            <button>Play</button>
            <button>My List</button>
          </nav>
          <p>{`${enteredBanner.overview}..`}</p>
        </div>
      </div>
    );
  }
};

export default Banner;
