async email => {
    const dialogs = await application.auth.getDialogsByEmail(email);
    return dialogs;
};