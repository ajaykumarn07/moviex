import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import "./App.css";
import { Home, Details, Explore, PageNotFound, SearchResult } from "./pages";
import { Header, Footer } from "./components";

import { fetchDataFromApi } from "./utils/api";

const App = () => {
  const disptch = useDispatch();
  const { url } = useSelector((state) => state.home);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      disptch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promise = [];
    let endPoint = ["tv", "movie"];
    let allGenres = {};
    endPoint.forEach((url) => {
      return promise.push(fetchDataFromApi(`/genre/${url}/list`));
    });
    const data = await Promise.all(promise);
    console.log(data);
    data.map(({ genres }) => {
      return genres.map((item) => {
        allGenres[item.id] = item;
      });
    });

    console.log(allGenres);
    disptch(getGenres(allGenres));
  };

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
