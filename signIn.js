var loginBtn = document.getElementById("loginBtn");
var registerBtn = document.getElementById("registerBtn");
var loginForm = document.getElementById("login");
var registerForm = document.getElementById("register");

function login() {
    loginForm.style.left = "4px";
    registerForm.style.right = "-520px";
    loginBtn.classList.remove("none");
    registerBtn.classList.add("none");
    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
}

function register() {
    loginForm.style.left = "-510px";
    registerForm.style.right = "5px";
    loginBtn.classList.add("none");
    registerBtn.classList.remove("none");
    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;
}

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

