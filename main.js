const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const users = [];
const dataPanel = document.querySelector("#data-panel");
//const card_crown = document.querySelector(".btn-add-favorite");
//const card_avatar = document.querySelector(".card-img-top");
const randomButton = document.querySelector("#btn-random-user");
const randomInfo = document.querySelector(".random-info");
const userDetail = document.querySelector(".user-detail");
const paginator = document.querySelector('.pagination');
const DATA_PER_PAGE = 16;
let currentPage = 1;

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results);
  renderUserList(getUserbyPage(currentPage));
  renderPaginator(users);
  changeActivePageStyle(1);
});

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
  dataPanel.innerHTML = rawHTML
}

//use to render userlist gender's i class
function classifiedGender(user_gender) {
  if (user_gender === "female") {
    return '<i class="fas fa-venus gender-girl"></i>';
  } else if (user_gender === "male") {
    return '<i class="fas fa-mars gender-boy"></i>';
  }
}

randomButton.addEventListener('click', () => renderSpecialGuy(users))

//randomly create a number as id and render a profile.
function renderSpecialGuy(users){
  const number = Math.ceil(Math.random() * users.length)
  const user = users[number];
  randomInfo.innerHTML = `
        <div class="info">
        <div class="info-left col-3 mx-5">
          <img src="${user.avatar}" id="user-avatar" alt="user-avatar" />
        </div>
        <div class="info-right col-6">
          <p>Name: ${user.name} ${user.surname}<button class=" btn btn-sm badge rounded-pill">${user.gender}</button></p>
          <p>region: ${user.region}</p>
          <p>age: ${user.age}</p>
          <p>email: ${user.email}</p>
        </div>
      </div>`;
}

dataPanel.addEventListener('click', function onCrownClicked(event) {
  if (event.target.matches(".btn-add-favorite")){
    addToFavorite(Number(event.target.dataset.id))
  }
  else if (event.target.matches(".card-img-top")) {
    renderUserPanel(Number(event.target.dataset.id));
  }
})

function renderUserPanel(id){
  const modalTitle = document.querySelector('.modal-title')
  const userImage = document.querySelector('.col-5')
  const userDetail = document.querySelector('.col-7')
  axios.get(INDEX_URL + id).then((response) => {
    const {name, surname, email, avatar, gender, age, region, birthday} = response.data;
    modalTitle.innerText = `${name} ${surname}`
    userImage.innerHTML = `<img src="${avatar}" alt="user-avatar">`;
    userDetail.innerHTML = `<h3>name: ${name} ${surname}</h3>
          <p>gender: ${gender}</p>
          <p>age: ${age}</p>
          <p>region: ${region}</p>
          <p>birthday: ${birthday}</p>
          <p>email: ${email}</p>`;
})
}

function addToFavorite(id){
  const list = JSON.parse(localStorage.getItem('MyPartner')) || [];
  const data = users.find(user => user.id === id);
  if(list.some(user => user.id === id)){
    return alert (`haha, It's your friend already.`)
  }
  list.push(data);
  localStorage.setItem('MyPartner',JSON.stringify(list));
}

function renderPaginator(data){
  const totalPages = Math.ceil(data.length / DATA_PER_PAGE)
  for(let i = 1; i <= totalPages; i++){
    paginator.innerHTML += `
    <li class="page-item"><a class="page-link" href="#" data-id="${i}">${i}</a></li>
    `;
  }
}

function getUserbyPage(page){
  const startIndex = (page-1) * DATA_PER_PAGE;
  const endIndex = startIndex + DATA_PER_PAGE;
  return users.slice(startIndex, endIndex);
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  currentPage = Number(event.target.dataset.id)
  changeActivePageStyle()
  renderUserList(getUserbyPage(currentPage))
})

function changeActivePageStyle() {
  for (let i = 0; i < paginator.children.length; i++) {
    let pageItem = paginator.children[i].firstChild
    if (Number(pageItem.dataset.id) === currentPage) {
      pageItem.classList.add('activePage')
    } else pageItem.classList.remove("activePage");
  }
}