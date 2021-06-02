async ({ user1, user2 }) => {
  await application.functional.createDialog(user1, user2);
  return { result: 'success' };
};
