import { createContext, useState } from 'react';
import logo from './logo.svg';
import MovieForm from './components/MovieForm';
import Search from './components/Search';
import MoviesList from './components/MoviesList';

export const MovieContext = createContext(null);

function App() {
  console.log('APP');
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        searchValue,
        setSearchValue
      }}>
      <div className="container mx-auto">
        <Search />
        <MoviesList />
        <MovieForm />
      </div>
    </MovieContext.Provider>
  );
}

export default App;
