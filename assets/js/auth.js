var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUserByUsernameAndPassword } from "./utils/user.js";
const handleForLogin = () => __awaiter(void 0, void 0, void 0, function* () {
    const formLogin = document.getElementById("form-login");
    const alertLogin = document.getElementById("alert-login");
    formLogin.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        alertLogin.className = "alert";
        const username = formLogin.username.value;
        const password = formLogin.password.value;
        try {
            const user = yield getUserByUsernameAndPassword(username, password);
            alertLogin.textContent = "Login successful!";
            alertLogin.classList.add("alert-show", "alert-success");
            localStorage.setItem("user", JSON.stringify(user));
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        }
        catch (error) {
            alertLogin.textContent = error.message;
            alertLogin.classList.add("alert-show", "alert-danger");
            return;
        }
    }));
});
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    const loginBtn = document.getElementById("login-btn");
    const greeting = document.getElementById("greeting");
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    if (window.location.pathname.endsWith("login.html")) {
        handleForLogin();
    }
    if (!user && !window.location.pathname.endsWith("login.html")) {
        window.location.href = "login.html";
        return;
    }
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
    loginBtn.style.display = user ? "none" : "inline-block";
    logoutBtn.style.display = user ? "inline-block" : "none";
    greeting.classList.remove("hidden");
    greeting.textContent = user ? `Hai, ${user.firstName} 👋` : "";
});
