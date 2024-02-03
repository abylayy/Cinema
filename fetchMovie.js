// document.addEventListener("DOMContentLoaded", function () {
//     const urlParams = new URLSearchParams(window.location.search);
//     const movieId = urlParams.get('id');
//     const apiKey = 'b743d7d019776f52a4f6cc05ddbb9cbb';
//     const baseUrl = 'https://api.themoviedb.org/3/movie/';
//
//     // Fetch movie details from the API using the movie ID
//     const options = {
//         method: 'GET',
//         headers: {
//             accept: 'application/json',
//             Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNzQzZDdkMDE5Nzc2ZjUyYTRmNmNjMDVkZGJiOWNiYiIsInN1YiI6IjY1YWY5ZWU3M2UyZWM4MDBhZWM0NzU3MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jgwZokk5jQ_j4MBsjwkFQj3BbRiDnJHS6H9IDmVSoBo'
//         }
//     };
//
//     fetch(`https://api.themoviedb.org/3/movie/${movie_id}/images`, options)
//         .then(response => response.json())
//         .then(response => console.log(response))
//         .catch(err => console.error(err));
//
//             // Iterate over all properties in the response data
//             for (const [key, value] of Object.entries(data)) {
//                 // Create a paragraph for each property and append it to the container
//                 const paragraph = document.createElement('p');
//                 paragraph.textContent = `${key}: ${JSON.stringify(value)}`;
//                 movieDetailsContainer.appendChild(paragraph);
//             }
//         .catch(error => console.error('Error fetching movie details:', error));
// });
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'b743d7d019776f52a4f6cc05ddbb9cbb'
    }
};

fetch('https://api.themoviedb.org/3/movie/569094/images', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));