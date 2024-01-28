let loginPayload = {};

const login = document.getElementById("login");
const loginBtn = document.getElementById("login-btn");

login.addEventListener("change", (e) => {
  const alt = e.target.alt;
  const value = e.target.value;
  loginPayload[alt] = value;
});

loginBtn.addEventListener("click", async (e) => {
  try {
    const { data } = await axios.post("/api/v1/auth/login", {
      ...loginPayload,
    });
    window.location.replace("/index.html");
  } catch (error) {
    alert(error.response.data.message);
  }
});
