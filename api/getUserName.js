async email => {
    const { name } = await application.auth.getUserName(email);
    return { result: 'success', name };
};
