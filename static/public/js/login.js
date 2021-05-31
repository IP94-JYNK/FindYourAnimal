import { getApi } from './general/loader.js';
const load = ['status'];
const special = ['signIn'];

const form = document.querySelector('form');
const emailInput = document.querySelector('input[name="email"]');
const passwordInput = document.querySelector('input[name="password"]');
const notify = document.querySelector('.notify');

const wrongCredentials = () => {
  notify.innerText = `Wrong credentials`;
  notify.style.display = 'block';
  emailInput.value = '';
  passwordInput.value = '';
};

window.addEventListener('load', async () => {
  window.api = await getApi(load, special);
  const { result } = await api.status();
  if (result === 'logged') window.location = '/';
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const res = await api.signIn({ email, password });
    if (!res) wrongCredentials();
    if (res.result === 'success') window.location = '/';
  });
});
