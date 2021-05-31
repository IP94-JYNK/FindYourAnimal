async ({ user1, dialogId, content }) => {
  await application.auth.createMessage(
    user1,
    dialogId,
    content
  );
  return { result: 'success' };
};
