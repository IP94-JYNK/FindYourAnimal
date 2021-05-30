async ({ user1, user2 }) => {
  await application.auth.createDialog(user1, user2);
  return { result: 'success' };
};
