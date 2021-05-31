async ({ search }) => {
  const pets = await application.auth.searchPet(`*${search}*`);
  return { result: 'success', pets };
};
