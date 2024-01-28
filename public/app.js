const content = document.querySelector(".content");
const logoutBtn = document.getElementById("logout-btn");
const showMe = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:5000/api/v1/users/showMe"
    );
    content.innerHTML = `<h1>Hey <span>${data.user.name}</span></h1>
    <p>Your ID : <span>${data.user.userID}</span></p>
    <p>Your role : <span>${data.user.role}</span></p>`;
  } catch (error) {
    window.location.replace("/homepage/home.html");
  }
};

showMe();

logoutBtn.addEventListener("click", async () => {
  try {
    await axios.get("http://localhost:5000/api/v1/auth/logout");
    showMe();
  } catch (error) {
    alert(error.response.data.message);
  }
});
