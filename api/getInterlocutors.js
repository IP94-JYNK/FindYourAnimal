async email => {
    const interlocutors = await application.auth.getInterlocutors(email);
    console.log(interlocutors);
    return interlocutors;
};