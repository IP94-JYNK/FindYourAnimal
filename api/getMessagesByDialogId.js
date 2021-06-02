async ({ dialogId }) => {
  const messages = await application.functional.getMessages(dialogId);
  return { result: 'success', messages };
};
