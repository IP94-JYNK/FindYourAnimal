async ({ user1, dialogId, content }) => {
  await application.functional.createMessage(
    user1,
    dialogId,
    content
  );
  return { result: 'success' };
};
