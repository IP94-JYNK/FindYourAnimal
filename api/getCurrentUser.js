async () => {
    const token = context.token;
    const user = await application.auth.getUserByToken(token);
    return user;
};