import React, { useEffect, useState } from "react";

import MovieDetail from "./MovieDetail";

import useAPI from "../../../hooks/useAPI";
import styles from "./MovieList.module.css";

// component render các list phim
// 1 component duy nhất để hiển thị danh sách phim
const MovieList = () => {
  const { movies, isLoading, isError, fetchMovies } = useAPI();

  const [showMovie, setShowMovie] = useState(false);
  const [isMovie, setIsMovie] = useState(null);

  // biến dùng để gọi custom hook với title sẽ là tiêu đề <h2> tương ứng với keyword để có thể chọn đúng link trong custom hook
  const genres = [
    { title: "Original", keyword: "fetchTrending" },
    { title: "Xu hướng", keyword: "fetchNetflixOriginals" },
    { title: "Xếp hạng cao", keyword: "fetchTopRated" },
    { title: "Hành động", keyword: "fetchActionMovies" },
    { title: "Hài", keyword: "fetchComedyMovies" },
    { title: "Kinh dị", keyword: "fetchHorrorMovies" },
    { title: "Lãng mạn", keyword: "fetchRomanceMovies" },
    { title: "Tài liệu", keyword: "fetchDocumentaries" },
  ];

  // lặp qua genres để gọi fetchAPI từ custom hook
  useEffect(() => {
    genres.forEach((genre) => {
      fetchMovies(genre.keyword);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMovies]);

  // Vì genres là một object sẽ không thay đổi. Nhưng trình duyệt lại hiện cảnh báo cần genres làm phụ thuộc. => dòng comment phía trên dùng để chặn cảnh báo đó.

  // xét các điều kiện để hiện/ẩn hay chuyển phim
  const clickHandler = (movie) => {
    if (!showMovie) {
      setIsMovie(movie);
      setShowMovie(true);
    } else {
      if (movie.id === isMovie.id) {
        setShowMovie(false);
      } else {
        setIsMovie(movie);
      }
    }
  };

  return (
    <div>
      {showMovie && <MovieDetail movieData={isMovie} />}
      {/* Original */}
      <ul className={styles.topList}>
        {isLoading && <p className={styles.reject}>Loading...</p>}
        {isError["fetchTrending"] && (
          <p className={styles.reject}>{isError["fetchTrending"]}</p>
        )}
        {movies["fetchTrending"] &&
          movies["fetchTrending"].map((movie) => (
            <li key={movie.id}>
              <img
                src={movie.poster}
                alt={movie.title}
                onClick={() => clickHandler(movie)}
              />
            </li>
          ))}
      </ul>
      {/* Các danh sách phim còn lại */}
      {genres.slice(1).map((genre) => (
        <div key={genre.keyword}>
          <h2 className={styles.genres}>{genre.title}</h2>
          <ul className={styles.navList}>
            {isLoading && <p className={styles.reject}>Loading...</p>}
            {isError[genre.keyword] && (
              <p className={styles.reject}>{isError[genre.keyword]}</p>
            )}
            {movies[genre.keyword] &&
              movies[genre.keyword].map((movie) => (
                <li className={styles.image} key={movie.id}>
                  <img
                    // dùng Backdrop
                    // nhưng một số bộ phim có link backdrop (bị lỗi?) không có đuôi .jpg nên không thể lấy ảnh về render được. Nên dùng poster thay thế cho số ít trường hợp đó.
                    src={
                      movie.backdrop.indexOf(".jpg") === -1
                        ? movie.poster
                        : movie.backdrop
                    }
                    alt={movie.title}
                    onClick={() => clickHandler(movie)}
                  />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default MovieList;
