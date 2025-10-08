import { getUserByUsernameAndPassword } from "./utils/user.js";

const handleForLogin = async () => {
  const formLogin = document.getElementById("form-login") as HTMLFormElement;
  const alertLogin = document.getElementById("alert-login") as HTMLDivElement;

  formLogin.addEventListener("submit", async (e: SubmitEvent) => {
    e.preventDefault();
    alertLogin.className = "alert";

    const username = formLogin.username.value;
    const password = formLogin.password.value;

    try {
      const user = await getUserByUsernameAndPassword(username, password);

      alertLogin.textContent = "Login successful!";
      alertLogin.classList.add("alert-show", "alert-success");
      localStorage.setItem("user", JSON.stringify(user));
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error: unknown) {
      alertLogin.textContent = (error as Error).message;
      alertLogin.classList.add("alert-show", "alert-danger");
      return;
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
  const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;
  const greeting = document.getElementById("greeting") as HTMLParagraphElement;

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
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
