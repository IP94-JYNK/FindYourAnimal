async () => {
  const { token } = context;
  const user = await application.functional.getUserByToken(token);
  return { result: 'success', user };
};
