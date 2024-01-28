const newPasswordClass = document.querySelector(".new-pwd");
const confirmPasswordClass = document.querySelector(".cnf-pwd");
const submitButton = document.getElementById("submit-btn");
const verifyEmailLogin = document.getElementById("verify-email-login");
const passwordResetMessage = document.getElementById("password-reset-message");

const urlParams = new URLSearchParams(window.location.search);
const tokenParam = urlParams.get("token");
const emailParam = urlParams.get("email");

let newPassword, confirmPassword;
newPasswordClass.addEventListener("change", (e) => {
  e.preventDefault();
  newPassword = e.target.value;
});
confirmPasswordClass.addEventListener("change", (e) => {
  e.preventDefault();
  confirmPassword = e.target.value;
});

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (newPassword !== confirmPassword) {
    alert("Passwords don't match");
    return;
  }
  try {
    const { data } = await axios.patch(
      "http://localhost:5000/api/v1/auth/reset-password",
      {
        email: emailParam,
        passwordResetToken: tokenParam,
        newPassword,
      }
    );
    passwordResetMessage.innerText = data.message;
    verifyEmailLogin.style.display = "block";
  } catch (error) {
    alert(error.response.data.message);
  }
});
