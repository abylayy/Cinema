document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear the token
            document.cookie = 'token=; expires=Thu, 01 Jan 1000 00:00:00 UTC; path=/;';

            updateNavbar();
        });
    }

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    if (loginBtn && registerBtn) {
        loginBtn.addEventListener("click", moveLogin);
        registerBtn.addEventListener("click", moveRegister);
    }

    const loginSubmitBtn = document.getElementById("loginSubmit");
    const registerSubmitBtn = document.getElementById("registerSubmit");

    if (loginSubmitBtn && registerSubmitBtn) {
        loginSubmitBtn.addEventListener("click", login);
        registerSubmitBtn.addEventListener("click", register);
    }

    let marker = document.querySelector('.marker');
    let items = document.querySelectorAll('nav ul li');

    function indicator(e) {
        marker.style.left = e.offsetLeft + "px";
        marker.style.width = e.offsetWidth + "px";
    }

    items.forEach(link => {
        link.addEventListener("click", (e) => {
            indicator(e.target);
        });
    });

});

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
            const { token } = response.data;
            document.cookie = `token=${token}; expires=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}; path=/`;

            updateNavbar();

            console.log(response.data.message);

            window.location.href = "index.html";
            alert(`Welcome to KinoKor ${email}`);

        })
        .catch(error => {
            console.error(error.response.data.message);

            alert("Invalid email or password. Please try again.");
        });
}

function updateNavbar() {
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginBtn && logoutBtn) {
        const token = getCookie('token');

        if (token) {
            loginBtn.classList.add('hidden');
            logoutBtn.classList.remove('hidden');
        } else {
            loginBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
        }
    }
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue); // Decode the cookie value
        }
    }
    return null;
}


