const verifyEmailBtn = document.getElementById("verify-email-btn");
const successMsg = document.getElementById("success-msg");
const verifyEmailLogin = document.getElementById("verify-email-login");
const urlParams = new URLSearchParams(window.location.search);
const tokenParam = urlParams.get("token");
const emailParam = urlParams.get("email");

verifyEmailBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const { data } = await axios.patch("/api/v1/auth/verify-email", {
      verificationToken: tokenParam,
      email: emailParam,
    });
    successMsg.innerText = data.message;
    verifyEmailLogin.style.display = "block";
  } catch (error) {
    alert(error.response.data.message);
  }
});
