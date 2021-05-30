async ({ user1, user2 }) => {
    const result = await application.auth.createDialog(user1, user2);
    return { result: 'success' };
};
