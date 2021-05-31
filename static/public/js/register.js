import { getApi } from './general/loader.js';
const load = ['registerUser', 'status'];
const special = ['signIn'];
(async () => {
  window.api = await getApi(load, special);
  const { result } = await api.status();
  if (result === 'logged') window.location = '/';
})();

window.addEventListener('load', async () => {
  const form = document.querySelector('form');
  const notify = document.querySelector('.notify');
  const nameInput = document.querySelector('input[name="fullName"]');
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]');
  const password_confInput = document.querySelector(
    'input[name="password_conf"]'
  );

  const exist = arg => {
    notify.innerText = `User with the same ${arg} already exists.
    Please, enter another ${arg}`;
    notify.style.display = 'block';
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    password_confInput.value = '';
  };

  form.addEventListener('submit', async e => {
    notify.style.display = 'none';
    console.log(e);
    e.preventDefault();
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const password_conf = password_confInput.value;
    const favorites = [];
    if (password === password_conf) {
      const insert = await api.registerUser({
        name,
        email,
        password,
        favorites,
      });
      const { denied } = insert;
      if (denied) return exist(denied);
      const res = await api.signIn({ email, password });
      if (res.result === 'success') window.location = '/';
    } else {
      notify.innerText = 'Passwords should match';
      notify.style.display = 'block';
      passwordInput.value = '';
      password_confInput.value = '';
    }
  });
});
