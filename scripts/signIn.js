var loginBtn = document.getElementById("loginBtn");
var registerBtn = document.getElementById("registerBtn");
var loginForm = document.getElementById("login");
var registerForm = document.getElementById("register");

function moveLogin() {
    loginForm.style.left = "4px";
    registerForm.style.right = "-520px";
    loginBtn.classList.remove("none");
    registerBtn.classList.add("none");
    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
}

function moveRegister() {
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
});

function register() {
    const firstName = document.getElementById("registerFirstName").value;
    const lastName = document.getElementById("registerLastName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    // Make a request to the server to create a new user
    axios.post('/user/create', {
        firstName,
        lastName,
        email,
        password
    })
        .then(response => {
            console.log(response.data.message);
            alert("Registration successful! You can now sign in.");

            window.location.href = "signIn.html";
        })
        .catch(error => {
            console.error(error.response.data.message);

            alert(error.response.data.message);
        });
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const firstName = document.getElementById("registerFirstName").value;

    axios.post('/user/login', {
        firstName,
        email,
        password
    })
        .then(response => {
            console.log(response.data.message);

            window.location.href = "index.html";
            alert(`Welcome to KinoKor ${email}`);

        })
        .catch(error => {
            console.error(error.response.data.message);

            alert("Invalid email or password. Please try again.");
        });
}

