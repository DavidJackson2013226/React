import { useContext } from 'react';
import { MovieContext } from '../App';

function MoviesList() {
    const moviesContext = useContext(MovieContext);
    const movies = moviesContext.movies;
    const searchValue = moviesContext.searchValue;
    
    console.log('MovieContexgt');
    console.log('searchValue at MovieList', searchValue);
    console.log(movies);
    // const temp = movies.filter(movie => movie.name.includes(searchValue));
    // console.log(temp);
    movies.sort((a, b) => b.realDuration - a.realDuration);
    const filters =  movies.filter(movie => movie.name.includes(searchValue));

    return (
        <div>
            <dl className="max-w-full text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700 m-3 content-center">
                {
 
                    filters.map((movie, index) => (
                            <div className="flex flex-col pb-3" key={index}>
                                <dt className="mb-1 text-gray-500 md:text-lg dark:text-gray-400">
                                    {movie.name}
                                </dt>
                                <dd className="text-lg font-semibold">{`${movie.ratings}/${movie.realDuration}h`}</dd>
                            </div>
                            )
                        )
                }
            </dl>
        </div>
    );
}

export default MoviesList;