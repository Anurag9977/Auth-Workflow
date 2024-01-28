const emailInput = document.getElementById("email-input");
const successMsg = document.getElementById("success-msg");
const submitBtn = document.getElementById("submit-btn");
let emailPayload = {};

emailInput.addEventListener("change", (e) => {
  e.preventDefault();
  emailPayload.email = e.target.value;
});

submitBtn.addEventListener("click", async (e) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/v1/auth/forgot-password",
      {
        ...emailPayload,
      }
    );
    successMsg.innerText = data.message;
  } catch (error) {
    alert(error.response.data.message);
  }
});
