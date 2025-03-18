// Toggle Menu
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Close menu when clicking on a nav link
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
    });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const API_BASE_URL = "http://localhost:5000/api/auth"; // Ensure backend is running

document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const registerForm = document.getElementById("registerForm");
    const authMessage = document.getElementById("authMessage");
    const personalAccessBtn = document.getElementById("personalAccess");
    const generalAccessBtn = document.getElementById("generalAccess");
    const registerOption = document.getElementById("registerOption");
    const registerLink = document.getElementById("registerLink");

    // ✅ Hide forms initially
    if (authForm) authForm.style.display = "none";
    if (registerForm) registerForm.style.display = "none";

    // ✅ Clicking General Access redirects directly
    if (generalAccessBtn) {
        generalAccessBtn.addEventListener("click", () => {
            window.location.href = "general.html";
        });
    }

    // ✅ Clicking Personal Access shows the Login Form
    if (personalAccessBtn) {
        personalAccessBtn.addEventListener("click", () => {
            if (authForm) authForm.style.display = "block";
            if (registerForm) registerForm.style.display = "none";
            if (registerOption) registerOption.style.display = "block"; // Show "New user? Register"
        });
    }

    // ✅ Clicking "Create an Account" should show the Registration Form
    if (registerLink) {
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (authForm) authForm.style.display = "none";
            if (registerForm) registerForm.style.display = "block";
        });
    }

    // 🏷 Handle User Login
    if (authForm) {
        authForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username")?.value.trim();
            const password = document.getElementById("password")?.value.trim();
            const email = document.getElementById("email")?.value.trim(); // Get email
            const loginBtn = authForm.querySelector("button");

            if (!username || !password || !email) {
                authMessage.innerHTML = "❌ Please fill in all fields.";
                return;
            }

            loginBtn.disabled = true;
            loginBtn.innerText = "Logging in...";

            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();
                console.log("Login Response:", data);

                if (response.ok) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    authMessage.innerHTML = `✅ Welcome, ${data.user.username || data.user.email}!`;
                    setTimeout(() => {
                        window.location.href = "personal.html";
                    }, 1000);
                } else {
                    authMessage.innerHTML = `❌ ${data.message || "Invalid login credentials"}`;
                }
            } catch (error) {
                console.error("Login Error:", error);
                authMessage.innerHTML = "⚠️ Server error. Please try again.";
            } finally {
                loginBtn.disabled = false;
                loginBtn.innerText = "Login";
            }
        });
    }

    // 🏷 Handle User Registration
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const regUsername = document.getElementById("regUsername").value.trim();
            const regEmail = document.getElementById("regEmail").value.trim();
            const regPassword = document.getElementById("regPassword").value.trim();
            const registerBtn = registerForm.querySelector("button");

            if (!regUsername || !regEmail || !regPassword) {
                authMessage.innerHTML = "❌ Please fill in all fields.";
                return;
            }

            registerBtn.disabled = true;
            registerBtn.innerText = "Registering...";

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: regUsername, email: regEmail, password: regPassword }),
                });

                const data = await response.json();
                console.log("Registration Response:", data);

                if (response.ok) {
                    alert("✅ Registration Successful! Please log in.");
                    if (authForm) authForm.style.display = "block";
                    if (registerForm) registerForm.style.display = "none";
                } else {
                    authMessage.innerHTML = `❌ ${data.message || "Registration failed."}`;
                }
            } catch (error) {
                console.error("Registration Error:", error);
                authMessage.innerHTML = "⚠️ Server error. Please try again.";
            } finally {
                registerBtn.disabled = false;
                registerBtn.innerText = "Register";
            }
        });
    }
});


