async ({ token }) => {
  const user = await application.functional.getUserByToken(token);
  return { result: 'success', user };
};
