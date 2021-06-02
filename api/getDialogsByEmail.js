async ({ email }) => {
  const dialogs = await application.functional.getDialogsByEmail(email);
  return { result: 'success', dialogs };
};
