async ({ dialogId }) => {
  const messages = await application.functional.getMessages(dialogId);
  const message = messages[messages.length - 1];
  return { result: 'success', message };
};
