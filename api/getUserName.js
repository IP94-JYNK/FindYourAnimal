async email => {
    const userName = await application.auth.getUserName(email);
    console.log(userName);
    return userName.name;
};