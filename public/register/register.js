const register = document.getElementById("register");
const registerBtn = document.getElementById("register-btn");
const successRegMsg = document.getElementById("success-reg-msg");
let registerPayload = {};

register.addEventListener("change", (e) => {
  const alt = e.target.alt;
  const value = e.target.value;
  registerPayload[alt] = value;
});

registerBtn.addEventListener("click", async (e) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/v1/auth/register",
      { ...registerPayload }
    );
    successRegMsg.innerText = data.message;
  } catch (error) {
    alert(error.response.data.message);
  }
});
