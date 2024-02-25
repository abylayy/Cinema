document.addEventListener('DOMContentLoaded', async function () {

    let currentPage = 1;
    let currentApiEndpoint = '/movies';
    let isSearchActive = false;
    let currentSearchQuery = '';


    try {
        const movies = await fetchMovies();
        renderMovieCards(movies);

    } catch (error) {
        console.error('Error fetching movie data:', error);
    }

    const cinemaCards = document.querySelectorAll('.cinema-card a');

    cinemaCards.forEach((cinemaLink) => {
        cinemaLink.addEventListener('click', (event) => {
            console.log('Cinema link clicked');
            event.preventDefault();
            console.log('Prevented default behavior');
            window.location.href = '/seatBooking';
            console.log('Redirected to seat booking page');
        });
    });

    // Function to fetch movies
    async function fetchMovies(page = 1) {
        try {
            const response = await axios.get(`/movies?page=${page}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie data:', error);
            throw error;
        }
    }

    const searchInput = document.getElementById('movie-search-input');
    const searchButton = document.getElementById('movie-search-button');

    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    async function performSearch(query) {
        // Validate the search query
        if (!query.trim()) {
            alert('Please enter a search query.');
            return;
        }

        isSearchActive = true;
        currentSearchQuery = query;
        currentPage = 1;

        try {
            const movies = await fetchMoviesByQuery(query);
            clearMovieCards();

            // Check if no movies found
            if (movies.length === 0) {
                alert('Unfortunately, no movies found for the provided search query.');
                return;
            }

            renderMovieCards(movies);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    async function fetchMoviesByQuery(query, page = 1) {
        try {
            const response = await axios.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie data:', error);
            throw error;
        }
    }

    //Filter
    const allFilters = document.querySelector('.all-filters');
    const topRatedFilters = document.querySelector('.top-filters');
    const nowPlayingFilters = document.querySelector('.now-filters');
    const upcomingFilters = document.querySelector('.category-filters');

    allFilters.addEventListener('click', () => handleFilterClick('/movies', allFilters));
    topRatedFilters.addEventListener('click', () => handleFilterClick('/movies/top', topRatedFilters));
    nowPlayingFilters.addEventListener('click', () => handleFilterClick('/movies/now', nowPlayingFilters));
    upcomingFilters.addEventListener('click', () => handleFilterClick('/movies/upcoming', upcomingFilters));

    // Function to handle filter click
    async function handleFilterClick(apiEndpoint, clickedFilterElement) {
        isSearchActive = false;
        currentPage = 1; // Reset to first page for new filter
        currentApiEndpoint = apiEndpoint;

        document.querySelectorAll('.filters').forEach(filter => {
            filter.classList.remove('active');
        });

        clickedFilterElement.classList.add('active');

        try {
            const movies = await fetchMovies(currentApiEndpoint);
            clearMovieCards();
            renderMovieCards(movies);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    }

    // Function to fetch movies
    async function fetchMovies(apiEndpoint = '/movies', page = 1) {
        try {
            // Construct the URL with the page number
            const url = `${apiEndpoint}?page=${page}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie data:', error);
            throw error;
        }
    }

// Event listener for the Load More button
    const loadMoreButton = document.getElementById('load-more-button');

    loadMoreButton.addEventListener('click', async () => {
        currentPage++;  // Increment to fetch the next page

        try {
            let newMovies;
            if (isSearchActive) {
                newMovies = await fetchMoviesByQuery(currentSearchQuery, currentPage);
            } else {
                // Fetch next page based on the current filter
                newMovies = await fetchMovies(currentApiEndpoint, currentPage);
            }

            // If there are no more movies to load, disable the button
            if (newMovies.length === 0) {
                loadMoreButton.disabled = true;
            }

            renderMovieCards(newMovies);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        }
    });


    // Function to clear existing movie cards
    function clearMovieCards() {
        const movieCardSection = document.querySelector('.movie-cardd-section');
        movieCardSection.innerHTML = '';
    }

    // Function to render movie cards
    function renderMovieCards(movies) {
        const movieCardSection = document.querySelector('.movie-cardd-section');

        movies.forEach((movie) => {
            const card = document.createElement('div');
            card.classList.add('cardd');

            const image = document.createElement('img');
            if (!movie.posterPath) {
                image.src = 'https://st2.depositphotos.com/2493575/5398/i/450/depositphotos_53989081-stock-photo-black-texture.jpg';
            } else {
                image.src = movie.posterPath;

            }
            image.alt = movie.title;
            image.addEventListener('click', async () => {
                try {
                    // Fetching trailers from TMDB
                    const trailersResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=b743d7d019776f52a4f6cc05ddbb9cbb`);
                    const trailersData = trailersResponse.data.results.filter(video => video.type === 'Trailer');

                    sessionStorage.setItem(`movieTrailers_${movie.id}`, JSON.stringify(trailersData));

                    window.location.href = `/movieDetails.html?movieId=${movie.id}`;
                } catch (error) {
                    console.error('Error fetching trailers:', error);
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

// for menu scroll
let nav = document.querySelector('nav');
window.addEventListener("scroll", () => {
    if (window.pageYOffset >= 20) {
        nav.classList.add('nav');
    } else {
        nav.classList.remove('nav');
    }

    if (window.pageYOffset >= 700) {
        nav.classList.add('navBlack');
    } else {
        nav.classList.remove('navBlack');
    }
});

$(document).ready(function () {
    $(".carousel").owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 3,
                nav: true
            },
            600: {
                items: 3,
                nav: true
            },
            1000: {
                items: 3,
                nav: true
            }
        }
    });
});
