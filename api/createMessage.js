async ({ user1, dialogId, content }) => {
    const result = await application.auth.createMessage(
        user1,
        dialogId,
        content
    );
    return { result: 'success' };
};
