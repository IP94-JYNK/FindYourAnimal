async ({ dialogId }) => {
  const message = await application.auth.getLastMessageByDialogId(dialogId);
  return { result: 'success', message };
};
