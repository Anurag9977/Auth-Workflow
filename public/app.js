const content = document.querySelector(".content");
const logoutBtn = document.getElementById("logout-btn");
const mainContainer = document.querySelector(".main-container");
const showMe = async () => {
  try {
    const { data } = await axios.get("/api/v1/users/showMe");
    content.innerHTML = `<h1>Hey <span>${data.user.name}</span></h1>
    <p>Your ID : <span>${data.user.userID}</span></p>
    <p>Your role : <span>${data.user.role}</span></p>`;
    mainContainer.style.display = "flex";
  } catch (error) {
    window.location.replace("/homepage/home.html");
  }
};

showMe();

logoutBtn.addEventListener("click", async () => {
  try {
    await axios.get("/api/v1/auth/logout");
    showMe();
  } catch (error) {
    alert(error.response.data.message);
  }
});
