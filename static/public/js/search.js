import { getApi } from './general/loader.js';
const load = ['searchPet'];
(async () => {
  window.api = await getApi(load);
})();

const createCard = pet => `
<div class="col-12 col-sm-4">
<div class="card">
  <img
    class="card-img-top"
    src="../public/img/trevis_id.webp"
    alt="Avatar"
    height="300"
  />
  <div class="card-body">
    <h5 class="card-title">${pet.alias}</h5>
    <h6 class="card-subtitle mb-2 text-muted">
      ${pet.description}
    </h6>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Кличка: ${pet.alias}</li>
    <li class="list-group-item">Возраст: ${pet.age}</li>
    <li class="list-group-item">Пол: ${pet.sex}</li>
    <li class="list-group-item">Вид животного: ${pet.type}</li>
    <li class="list-group-item">Порода: ${pet.species}</li>
    <li class="list-group-item">Местонахождение: ${pet.location}</li>
  </ul>
  <div class="card-body">
    <span class="fa fa-comment fa-lg float-left"
      ><a class="card-link" href="#"> Написать</a></span
    >
    <span class="fa fa-heart fa-lg float-right"
      ><a class="card-link" href="#"> Запомнить</a></span
    >
  </div>
  <div class="card-body">
    <span class="fa fa-user-circle-o fa-lg float-left"
      ><a class="card-link" href="#"> Профиль владельца</a></span
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

    const { pets, result } = await api.searchPet({ search: searchString });
    if (result !== 'success') {
      console.log(pets);
      return;
    }
    const petsCards = pets.map(pet => createCard(pet));
    cards.innerHTML = petsCards.join('');
  });
});
