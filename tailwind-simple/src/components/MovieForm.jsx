import {useState, useContext} from 'react';
import {MovieContext} from '../App';

function MovieForm () {
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        ratings: 0
    });
    const [error, setError] = useState({
        name: false,
        duration: false,
        ratings: false
    });
    
    const movieContext = useContext(MovieContext);

    const onchange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const onsubmit = (e) => {
        e.preventDefault();
        const {name, duration, ratings} = formData;
        const lastChar = duration[duration.length - 1];
        const value = duration.slice(0, duration.length - 1);
        if (lastChar != 'h' && lastChar != 'm') {
            alert('lastChar error');
            return ;
        }
        if (isNaN(value)) {
            alert('isNaN error');
            return ;
        }
        if (ratings > 100) {
            alert('ratings');
            return ;
        }
        const realDuration = lastChar == 'm' ? parseFloat(value) / 60 : parseFloat(value);
        alert(realDuration);
        movieContext.setMovies(pre => ([
            ...pre,
            {name, realDuration, ratings}
        ]));
    };

    return (
        <form>
            <div className="m-3">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input 
                    type="text" 
                    name="name"
                    id="default-input" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    onChange={onchange}
                    value={formData['name']}
                    />
            </div>
            <div className="m-3">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ratings</label>
                <input 
                    type="number" 
                    name="ratings"
                    id="default-input" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={onchange}
                    value={formData['ratings']}
                     />
            </div>
            <div className="m-3">
                <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration</label>
                <input 
                    type="text" 
                    name="duration"
                    id="default-input" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={onchange}
                    value={formData['duration']}
                     />
            </div>
            <button
                type="submit"
                className="text-white absolute bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={onsubmit}
            >
                Submit
            </button>
        </form>
    );
}

export default MovieForm;