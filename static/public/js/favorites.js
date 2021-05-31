import { getApi } from './general/loader.js';

const load = ['status'];
const special = ['deleteFavorite'];

let user;
let favorites;
let profile;
const profiles = document.getElementById("profiles");
profiles.innerHTML = '';


const renderProfiles = (profile) => {
  return `<div class="col-12 col-md-6 col-lg-4 mb-5">
                <div class="card">
                <img class="card-img-top" src="../img/avatar.jpg" alt="Avatar">
                <div class="card-body">
                  <h5 class="card-title">${profile.name}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">About myself</h6>
                </div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">${profile.name}</li>
                    <li class="list-group-item">${profile.name}</li>
                    <li class="list-group-item">${profile.name}</li>
                  </ul>
                <div class="card-body">
                  <a class="btn btn-primary float-left chat" id="${profile.email}" href="/dialogs" role="button">Chat</a>
                  <a class="btn btn-dark float-right delete" id="${profile.email}" href="#" role="button">Delete</a> 
                </div>
                </div>
              </div>`
}


window.addEventListener('load', async () => {
  window.api = await getApi(load, special);

  user = await api.getCurrentUser();
  favorites = user.favorites; 

  //render HTML
  const renderView = async () => {
    let content = '';
    for await (const favorite of favorites) {
      profile = await application.auth.getUserByEmail(favorite);
      content += renderProfiles(profile);
    }
    profiles.innerHTML = content;
  };
  renderView();

  //delete button
  [...document.getElementsByClassName("delete")].forEach( el => el.addEventListener('click', e => {
    const target = e.target;
    let FavoriteEmail = target.getAttribute("id");
    let UserEmail = user.email;

    api.deleteFavorite(UserEmail, FavoriteEmail);
    renderView();
  }));

  
  //menu for small screens
  const showMenu = () => {
    document.getElementsByClassName("navbar-toggler")[0].addEventListener('click', e => {
      const target = e.target;
      if (target.getAttribute("aria-expanded") === "true") {
        target.removeAttribute("aria-expanded");
      } else {
        target.setAttribute("aria-expanded", "true");
      }
      document.getElementsByClassName("navbar-collapse")[0].classList.toggle("show");
    })
  }
  showMenu();

});
