import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import { flushSync } from "react-dom";
// import Star from "./Star";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZDM2ZDc2MDAyZDIwNTQ3Yjk1ZmJhYTFhNTE4MjAxZCIsInN1YiI6IjY2NzMyMDBlMGJkOWQwZWM1ZjM0NmNmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MJ5oq4G-pRRJxLkOqGYthtAuEdg0atsvPBISVMmFKeM'
  }
};
const KEY='e0d2b8e9'
export default function App() {
  const [movies, setmovies] = useState([]);
  const [watched, setWatched] = useState(()=>JSON.parse(localStorage.getItem("watched"))||[]);
  const [query, setQuery] = useState("");
  const[error,seterror]=useState("")
  const[loading,setloading]=useState(false);
 
  function handleonaddwatched(newmovie){
    setWatched([...watched,newmovie]);

  }
  function handledeletewatched(movieimdbID){
    setWatched(watched.filter((m)=>m.imdbID!==movieimdbID));
    // localStorage.removeItem()
  }
  

  
  useEffect(
    function () {
      const controller =new AbortController();
      const signal=controller.signal;
     

      async function fetchmovies() {

        // seterror("")
        // try{
        try { 
          seterror("")
        //   setloading(true);

          
          setloading(true);
          const data=await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:signal});
          if(!data.ok){
            throw new Error ("Oops! Something went wrong....")
          }

          const res=await data.json();
        if(res.Response==='False') throw new Error("Movie Not Found☹️")
          setmovies(res.Search);
        seterror("");
          // console.log(res.Search);
          // setloading(false);
        
        }
        catch(err){

          console.log(err.message);
          if(err.name!=="AbortError"){

            seterror(err.message);
          }

        }
        finally{
        
          setloading(false)
        }

       
        
        
      }
      if(query.length<3){
        setmovies([]);
        seterror("");
        return;
      }
      fetchmovies()
      return () => {
             controller.abort();
           };
    
    },
    [query]
  );

  useEffect(
    function(){

      function addinlist()
      {
        localStorage.setItem("watched", JSON.stringify(watched));
        
        
        
      }
      addinlist();
      
      
    }
,[watched]  );
  

  return (
    <>
      <Navbar movies={movies}>
        {" "}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search"
          type="text"
          placeholder="Search movies..."
        />
      </Navbar>
      <Main handledeletewatched={handledeletewatched} handleonaddwatched={handleonaddwatched} movies={movies} watched={watched} query={query} error={error} loading={loading} />
      {/* <Star></Star> */}
    </>
  );
}
