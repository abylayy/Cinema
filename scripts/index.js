document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/movies');
        const movies = await response.json();

        const movieCards = document.querySelectorAll('.cardd');

        movieCards.forEach((card, index) => {
            const posterImg = card.querySelector('img');
            posterImg.src = movies[index].posterPath;
        });
    } catch (error) {
        console.error('Error fetching movie posters:', error.message);
    }
});

//indicator
let marker = document.querySelector('.marker');
let items = document.querySelectorAll('nav ul li');


function indicator(e){
    marker.style.left = e.offsetLeft + "px";
    marker.style.width = e.offsetWidth + "px";
}

items.forEach(link =>{
    link.addEventListener("click",(e)=>{
        indicator(e.target);
    })
})



//for menu scroll
let nav = document.querySelector('nav');
let ul = document.querySelector('nav ul');

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