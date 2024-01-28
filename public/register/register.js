const register = document.getElementById("register");
const registerBtn = document.getElementById("register-btn");
const successRegMsg = document.getElementById("success-reg-msg");
const loadingGif = document.querySelector(".loading-gif");
let registerPayload = {};

register.addEventListener("change", (e) => {
  const alt = e.target.alt;
  const value = e.target.value;
  registerPayload[alt] = value;
});

registerBtn.addEventListener("click", async (e) => {
  try {
    registerBtn.style.display = "none";
    loadingGif.style.display = "block";
    const { data } = await axios.post("/api/v1/auth/register", {
      ...registerPayload,
    });
    loadingGif.style.display = "none";
    successRegMsg.innerText = data.message;
  } catch (error) {
    alert(error.response.data.message);
  }
});
