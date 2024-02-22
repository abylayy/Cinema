// filter.js

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Use the fetchMovies and renderMovieCards functions from index.js
        const movies = await fetchMovies(1);
        renderMovieCards(movies);

        // Your additional code in filter.js
    } catch (error) {
        console.error('Error in filter.js:', error);
    }

    const genres = [
        { "id": 28, "name": "Action" },
        { "id": 12, "name": "Adventure" },
        // ... (add the rest of the genres)
    ];

    const movieFilter = document.getElementById('movie-filter');

    // Event listener for genre filter change
    movieFilter.addEventListener('change', async () => {
        const selectedGenreId = movieFilter.value;
        let url;

        if (selectedGenreId === 'all') {
            url = '/movies';
        } else {
            url = `/movies?genre=${selectedGenreId}`;
        }

        try {
            // Pass the correct page number based on your server's pagination
            const filteredMovies = await fetchMovies(1, url);
            renderMovieCards(filteredMovies);
        } catch (error) {
            console.error('Error fetching filtered movie data:', error);
        }
    });

    // Populate genre filter options
    genres.forEach((genre) => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        movieFilter.appendChild(option);
    });

    // Function to fetch movies (copied from index.js)
    async function fetchMovies(page = 1, url = '/movies') {
        try {
            const response = await axios.get(`${url}?page=${page}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie data:', error);
            throw error;
        }
    }

    // Function to render movie cards (copied from index.js)
    function renderMovieCards(movies) {
        const movieCardSection = document.querySelector('.movie-cardd-section');

        // Clear existing movie cards
        movieCardSection.innerHTML = '';

        movies.forEach((movie) => {
            const card = document.createElement('div');
            card.classList.add('cardd');

            const image = document.createElement('img');
            image.src = movie.posterPath;
            image.alt = movie.title;

            image.addEventListener('click', async () => {
                try {
                    const movieDetailsResponse = await axios.get(`/movieDetails/${movie.id}`);
                    const movieDetails = movieDetailsResponse.data;

                    window.location.href = `/movieDetails/${movieDetails.id}`;

                } catch (error) {
                    console.error('Error fetching movie details:', error);
                }
            });

            const content = document.createElement('div');
            content.classList.add('cardd-content');

            const movieName = document.createElement('p');
            movieName.classList.add('movie-name');
            const movieLink = document.createElement('a');
            movieLink.href = `/movieDetails/${movie.id}`;
            movieLink.textContent = movie.title;
            movieName.appendChild(movieLink);

            content.appendChild(movieName);

            card.appendChild(image);
            card.appendChild(content);

            movieCardSection.appendChild(card);
        });
    }
});
