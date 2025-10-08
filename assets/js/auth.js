BASE_URL = "https://dummyjson.com/users";

const loggedIn = async (username, password) => {
  try {
    const res = await fetch(`${BASE_URL}`);
    const data = await res.json();
    const user = data.users.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) throw new Error("Invalid username or password");
    return user;
  } catch {
    throw new Error("Something went wrong, try again later");
  }
};

if (window.location.pathname.endsWith("login.html")) {
  const formLogin = document.getElementById("form-login");
  const alertLogin = document.getElementById("alert-login");

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertLogin.className = "alert";

    const username = formLogin.username.value;
    const password = formLogin.password.value;

    try {
      const user = await loggedIn(username, password);

      alertLogin.textContent = "Login successful!";
      alertLogin.classList.add("alert-show", "alert-success");

      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (error) {
      alertLogin.textContent = error.message;
      alertLogin.classList.add("alert-show", "alert-danger");
      return;
    }
  });
}

const logoutBtn = document.getElementById("logout-btn");
const loginBtn = document.getElementById("login-btn");
const greeting = document.getElementById("greeting");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && window.location.pathname.endsWith("login.html")) {
    window.location.href = "index.html";
    return;
  }
  if (!user && !window.location.pathname.endsWith("login.html")) {
    window.location.href = "login.html";
    return;
  }
  loginBtn.style.display = user ? "none" : "inline-block";
  logoutBtn.style.display = user ? "inline-block" : "none";

  greeting.classList.remove("hidden");
  greeting.textContent = user ? `Hai, ${user.firstName} 👋` : "";
});
