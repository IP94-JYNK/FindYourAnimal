async token => {
    const user = await application.auth.getUserByToken(token);
    return { result: 'success', user };
};
