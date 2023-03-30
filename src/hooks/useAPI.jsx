import { useState, useCallback } from "react";

const useAPI = () => {
  // useState
  const [isLoading, setIsLoading] = useState(true);
  const [enteredBanner, setEnteredBanner] = useState(null);
  const [errorBanner, setErrorBanner] = useState(false);
  const [movies, setMovies] = useState({});

  // đặt lỗi riêng cho từng đề mục render phim
  const [isError, setIsError] = useState({
    fetchTrending: false,
    fetchNetflixOriginals: false,
    fetchTopRated: false,
    fetchActionMovies: false,
    fetchComedyMovies: false,
    fetchHorrorMovies: false,
    fetchRomanceMovies: false,
    fetchDocumentaries: false,
  });

  const API_KEY = "83000cd8936af060f3b23e85fc264318";

  // hàm gọi API
  const fetchMovies = useCallback(async (keyword) => {
    setIsLoading(true);
    setErrorBanner(null);
    setIsError({
      fetchTrending: false,
      fetchNetflixOriginals: false,
      fetchTopRated: false,
      fetchActionMovies: false,
      fetchComedyMovies: false,
      fetchHorrorMovies: false,
      fetchRomanceMovies: false,
      fetchDocumentaries: false,
    });

    // objeck chứa phần đuôi của link. Khi gọi đúng key thì value của nó sẽ thay vào link lấy API
    const requests = {
      fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
      fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
      fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
      fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
      fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
      fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
      fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
      fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
      fetchSearch: `/search/movie?api_key=${API_KEY}&language=en-US`,
    };
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3${requests[keyword]}`
      );

      if (!response.ok) {
        throw new Error("Lỗi kết nối!");
      }

      const data = await response.json();

      // Biến đổi dữ liệu nhận được từ API
      const transformedMovie = data.results.map((movieData) => {
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

      // đưa từng list phim (array) vào object với key là thể loại phim (keyword nhận từ component sử dụng custom hook này.)
      setMovies((prevMovies) => ({
        ...prevMovies,
        [keyword]: transformedMovie,
      }));

      ////////////////
      // Phần code cho Banner

      // Chọn ngẫu nhiên một phim có trong array đã gọi với keyword là fetchNetflixOriginals từ component Banner
      const bannerMovieIndex = Math.floor(Math.random() * data.results.length);
      const bannerMovie = data.results[bannerMovieIndex];
      const transformedMovieBanner = {
        id: bannerMovie.id,
        title: bannerMovie.title || bannerMovie.name,
        overview: bannerMovie.overview.split(" ").slice(0, 26).join(" "),
        backdrop: `https://image.tmdb.org/t/p/original${bannerMovie.backdrop_path}`,
      };
      setEnteredBanner(transformedMovieBanner);

      ////////////////
    } catch (err) {
      console.log(err.message);
      setErrorBanner(err.message || "Đã xẫy ra lỗi!");

      // nhập vào các lỗi đúng theo key từng thể loại.
      setIsError((prevError) => ({
        ...prevError,
        [keyword]: err.message || "Đã xẫy ra lỗi!",
      }));
    }
    setIsLoading(false);
  }, []);

  // Trả ra từ custom hook này.
  return {
    movies,
    enteredBanner,
    isLoading,
    errorBanner,
    isError,
    fetchMovies,
  };
};

export default useAPI;
