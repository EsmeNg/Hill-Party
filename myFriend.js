const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const myFavorite = JSON.parse(localStorage.getItem("MyPartner"));
const userDetail = document.querySelector(".user-detail");
const paginator = document.querySelector(".pagination");
const DATA_PER_PAGE = 16;

renderUserList(getUserbyPage(1));
renderPaginator(myFavorite);

function renderUserList(users) {
  let rawHTML = "";
  users.forEach((user) => {
    const genderBadge = classifiedGender(user.gender);
    rawHTML += `
        <div class="col-sm-6 col-md-3 my-2">
          <div class="card h-100 text-white d-flex justify-content-center" style="width: 10rem;">
            <div class="header">
              <img src="${user.avatar}" class="card-img-top" alt="user-avatar" data-toggle="modal" data-target="#user-modal"
              data-id="${user.id}">
              ${genderBadge}
            </div>
            <div class="card-body d-flex">
              <h5 class="card-title">${user.name} ${user.surname}</h5>
              <button class="btn-add-favorite" data-id="${user.id}"><i class="fas fa-crown"></i></button>
            </div>
          </div>
        </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

//use to render userlist gender's i class
function classifiedGender(user_gender) {
  if (user_gender === "female") {
    return '<i class="fas fa-venus gender-girl"></i>';
  } else if (user_gender === "male") {
    return '<i class="fas fa-mars gender-boy"></i>';
  }
}

dataPanel.addEventListener("click", function onCrownClicked(event) {
  if (event.target.matches(".btn-add-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
    renderUserList(getUserbyPage(1));
  } else if (event.target.matches(".card-img-top")) {
    renderUserPanel(Number(event.target.dataset.id));
  }
});

function renderUserPanel(id) {
  const modalTitle = document.querySelector(".modal-title");
  const userImage = document.querySelector(".col-5");
  const userDetail = document.querySelector(".col-7");
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalTitle.innerText = `${data.name} ${data.surname}`;
    userImage.innerHTML = `<img src="${data.avatar}" alt="user-avatar">`;
    userDetail.innerHTML = `<h3>name: ${data.name} ${data.surname}</h3>
          <p>gender: ${data.gender}</p>
          <p>age: ${data.age}</p>
          <p>region: ${data.region}</p>
          <p>birthday: ${data.birthday}</p>
          <p>email: ${data.email}</p>`;
  });
}

function renderPaginator(data) {
  const totalPages = Math.ceil(data.length / DATA_PER_PAGE);
  let rawHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-id="${i}">${i}</a></li>
    `;
    }
  paginator.innerHTML = rawHTML;
}

function getUserbyPage(page) {
  const startIndex = (page - 1) * DATA_PER_PAGE;
  const endIndex = startIndex + DATA_PER_PAGE;
  return myFavorite.slice(startIndex, endIndex);
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  renderUserList(getUserbyPage(Number(event.target.dataset.id)));
});

function removeFromFavorite(id) {
  if (!myFavorite) return;
  //const userIndex = myFavorite.map(user => {return user.id;}).indexOf(id);
  const userIndex = myFavorite.findIndex((user) => user.id === id);
  if (userIndex === -1 ) return;
  myFavorite.splice(userIndex, 1);
  console.log(myFavorite);
  localStorage.setItem('MyPartner', JSON.stringify(myFavorite));
  renderUserList(myFavorite);
}