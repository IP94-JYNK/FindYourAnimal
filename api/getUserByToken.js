async token => {
    const user = await application.auth.getUserByToken(token);
    return user;
};