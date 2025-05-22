import { useState, useEffect } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import Moviecard from "./components/Moviecard";
import {useDebounce} from 'react-use';
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,//"Bearer" is a type of token-based authentication. It indicates that the provided token (in this case, API_KEY) should be used to grant access to the API.
  },
};


const App = () => {
  const [SearchTerm, setSearchTerm] = useState('');
  const [errormessage, setErrorMessage] = useState('');
  const [movielist,setmovielist]=useState([]);
  const [isloading,setIsLoading]=useState(false);
  const [debouncedSearchTerm,setdebouncedSearchTerm]=useState('');
  const[trendingMovies,setTrendingMovies]=useState([]);
  const[geners,setGeners]=useState([]);


  // Debounce the search term to prevent making to many Api request
  // by waiting for the User to Stop typing for 500ms
  useDebounce(()=>setdebouncedSearchTerm(SearchTerm),500,[SearchTerm])

  const fetchMovies = async (query='') => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const endpoint = query
      ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
       :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
       
      const response = await fetch(endpoint, API_OPTIONS);// fetch is used for the get the data from the api
////
      if(!response.ok){
        throw new Error('Failed to fetch data,try agian letter');
      }
///
      const data=await response.json();
///
      if(data.response==='False'){
        setErrorMessage(data.Error||'Failed to Fetch Movies');
        setmovielist([]);
        return;
      }
///      
      setmovielist(data.results||[]);

      if(query && data.results.length>0){
        await updateSearchCount(query,data.results[0]);
      }

    } catch (error) {
      console.error(`error fetching movies:${error}`);
      setErrorMessage("error fetching movies.please try again later.");
    }
    finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies=async()=>{
    try {
      const movies =await getTrendingMovies();
      setTrendingMovies(movies);

    } catch (error) {
    console.error(`Error fething trending movies:${error}`);
  //  setErrorMessage('Error fething trending movies:');
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies();
  },[]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
      <div className="element">
          <img src="./logo.png" alt="logo" />
          </div>      
        <header >     
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll Enjoy
            without the Hustle
          </h1>
          <Search searchTerm={SearchTerm} setSearchTerm={setSearchTerm} />
        </header>


        {trendingMovies.length>0 &&(
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index)=>(
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}


        <section className="all-movies">
          <h2 >All Movies</h2>
  
          {isloading?(
            <Spinner />
          ):errormessage?(
            <p className="text-red-500">{errormessage}</p>
          ):(
            <ul>
              {movielist.map((movie)=>(
               <Moviecard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
        );
};

export default App;
