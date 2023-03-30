import React, { useState } from "react";

// dùng lại icon tạo cho Navbar làm label
import { SearchIcon } from "../browse/Icon";

import styles from "./SearchForm.module.css";

const API_KEY = "83000cd8936af060f3b23e85fc264318";

const SearchForm = ({ setIsLoding, setError, setEnteredMovies }) => {
  const [inputSearch, setInputSearch] = useState("");

  // gọi API tìm phim
  const searchFetchMovie = async (query) => {
    setIsLoding(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(
          query
        )}`
      );
      // encodeURIComponent(query) để mã hóa tham số "query" trước khi nối nó vào URL.

      if (!response.ok) {
        throw new Error("Lỗi kết nối");
      }

      const data = await response.json();

      // nhập array phim bên trong data (data.results) vào array mới với mỗi phim là 1 object với key được viết tinh gọn
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.id,
          title: movieData.title || movieData.name,
          vote: movieData.vote_average,
          date: movieData.release_date,
          overview: movieData.overview,
          poster: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
        };
      });
      // sau đó truyền lại cho component Search
      setEnteredMovies(transformedMovies);
    } catch (err) {
      setError(err.message || "Đã xẫy ra lỗi");
    }

    // trong quá trình chạy, nó cũng truyền state Loading, Error về lại component Search.

    setIsLoding(false);
  };

  // hàm nhận input value
  const changeInputHandler = (event) => {
    setInputSearch(event.target.value);
  };

  // hàm khi nhấn Search, chỉ thực thi việc Search nếu không bỏ trống
  const clickSearchHandler = (event) => {
    event.preventDefault();
    if (inputSearch.trim().length !== 0) {
      searchFetchMovie(inputSearch);
    }
  };

  // Hàm Reset, reset lại input và các phần đã render ra về Loading, error hay phim đã tìm được. (nếu có)
  const clickResetHandler = (event) => {
    event.preventDefault();
    setInputSearch("");
    setEnteredMovies(null);
  };

  return (
    <form className={styles.searchForm}>
      <div className={styles.inputForm}>
        <input id="search" onChange={changeInputHandler} value={inputSearch} />
        <label htmlFor="search">
          <SearchIcon />
        </label>
      </div>
      <div className={styles.searchButton}>
        {/* type là reset để chuyển mặc định cho phím enter cho button còn lại */}
        <button type="reset" onClick={clickResetHandler}>
          RESET
        </button>
        <button onClick={clickSearchHandler}>SEARCH</button>
      </div>
    </form>
  );
};

export default SearchForm;
