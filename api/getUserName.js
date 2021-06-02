async ({ email }) => {
  const { name } = await application.functional.getUserByEmail(email);
  return { result: 'success', name };
};
