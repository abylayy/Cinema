document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await axios.get('/movies');

        const movies = response.data;

        const movieCardSection = document.querySelector('.movie-cardd-section');

        movieCardSection.innerHTML = '';

        movies.forEach((movie) => {
            const card = document.createElement('div');
            card.classList.add('cardd');

            const image = document.createElement('img');
            image.src = movie.posterPath;
            image.alt = movie.title;

            const content = document.createElement('div');
            content.classList.add('cardd-content');

            const movieName = document.createElement('p');
            movieName.classList.add('movie-name');
            const movieLink = document.createElement('a');
            movieLink.href = `movieDetails.html?id=${movie.id}`;
            movieLink.textContent = movie.title;
            movieName.appendChild(movieLink);

            content.appendChild(movieName);

            card.appendChild(image);
            card.appendChild(content);

            movieCardSection.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
});

//for menu scroll
let nav = document.querySelector('nav');
// let ul = document.querySelector('nav ul');

window.addEventListener("scroll",()=>{
    if(window.pageYOffset >= 20){
        nav.classList.add('nav');
    }else{
        nav.classList.remove('nav');
    }

    if(window.pageYOffset >= 700){
        nav.classList.add('navBlack');
    }else{
        nav.classList.remove('navBlack');
    }
})


$(".carousel").owlCarousel({
    margin: 20,
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
        0:{
            items:3,
            nav: true
        },
        600:{
            items:3,
            nav: true
        },
        1000:{
            items:3,
            nav: true
        }
    }
});