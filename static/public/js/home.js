import { getApi } from './general/loader.js';
const load = ['status', 'getUserInfo'];
const special = ['deleteUser'];
(async () => {
  window.api = await getApi(load, special);
  const { result } = await api.status();
  if (result === 'logged') {
    console.log('logged');
    setTimeout(async () => {
      await deleteUser();
      window.location = '/';
    }, 10000);
  } else {
    console.log('not logged');
  }
})();

const deleteUser = async () => {
  await api.deleteUser();
};
