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

function handleLogin() {
    let loginEmail = document.getElementById("loginEmail").value;
    let loginPassword = document.getElementById("loginPassword").value;

    // Example Axios POST request for login
    axios.post('/login', { email: loginEmail, password: loginPassword })
        .then(response => {
            // Handle successful login
            console.log(response.data);
            alert('Login successful!');
        })
        .catch(error => {
            // Handle login error
            console.error(error);
            alert('Login failed. Please check your credentials and try again.');
        });
}

function handleRegistration() {
    let registerFirstName = document.getElementById("registerFirstName").value;
    let registerLastName = document.getElementById("registerLastName").value;
    let registerEmail = document.getElementById("registerEmail").value;
    let registerPassword = document.getElementById("registerPassword").value;

    // Example Axios POST request for registration
    axios.post('/register', { firstName: registerFirstName, lastName: registerLastName, email: registerEmail, password: registerPassword })
        .then(response => {
            // Handle successful registration
            console.log(response.data);
            alert('Registration successful!');
        })
        .catch(error => {
            // Handle registration error
            console.error(error);
            alert('Registration failed. Please try again.');
        });
}

// Your existing code for the menu item indicator...
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
