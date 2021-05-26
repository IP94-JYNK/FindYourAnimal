async dialogId => {
    const messages = await application.auth.getMessages(dialogId);
    return messages;
};