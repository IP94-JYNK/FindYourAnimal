import { getApi } from './general/loader.js';
const load = ['searchOwner'];
(async () => {
  window.api = await getApi(load);
})();

const createCard = owner => `
<div class="col-12 col-sm-4">
<div class="card">
  <img
    class="card-img-top"
    src="../public/img/user.png"
    alt="Avatar"
    height="300"
  />
  <div class="card-body">
    <h5 class="card-title">${owner.name}</h5>
    <h6 class="card-subtitle mb-2 text-muted">
      Description(Описание): ${owner.description}
    </h6>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Age(Возраст): ${owner.age}</li>
    <li class="list-group-item">Location(Местонахождение): ${owner.location}</li>
  </ul>
  <div class="card-body">
    <span class="fa fa-heart fa-lg float-left"
      ><a class="card-link" href="#"> Лайк</a></span
    >
    <span class="fa fa-circle fa-lg float-right"
      ><a class="card-link" href="#"> Профиль</a></span
    >
  </div>
</div>
</div>
`;

window.addEventListener('load', async () => {
  const cards = document.querySelector('.row.row-content.align-items-center');
  const form = document.querySelector('#searchForm');
  console.log(form);
  const input = document.querySelector('#searchInp');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const searchString = input.value;
    if (!searchString) return;

    const { owners, result } = await api.searchOwner({ search: searchString });
    if (result !== 'success') {
      console.log(pets);
      return;
    }
    const ownersCards = owners.map(owner => createCard(owner));
    cards.innerHTML = ownersCards.join('');
  });
});
