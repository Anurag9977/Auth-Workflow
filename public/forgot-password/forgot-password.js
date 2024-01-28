const emailInput = document.getElementById("email-input");
const successMsg = document.getElementById("success-msg");
const submitBtn = document.getElementById("submit-btn");
const loadingGif = document.querySelector(".loading-gif");
let emailPayload = {};

emailInput.addEventListener("change", (e) => {
  e.preventDefault();
  emailPayload.email = e.target.value;
});

submitBtn.addEventListener("click", async (e) => {
  try {
    submitBtn.style.display = "none";
    loadingGif.style.display = "block";
    const { data } = await axios.post("/api/v1/auth/forgot-password", {
      ...emailPayload,
    });
    loadingGif.style.display = "none";
    successMsg.innerText = data.message;
  } catch (error) {
    alert(error.response.data.message);
  }
});
