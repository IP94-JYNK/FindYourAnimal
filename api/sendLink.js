({
  access: 'public',
  method: async ({ email, href }) => {
    const user = await application.auth.getUserByEmail(email);
    if (!user) return false;
    const linkTail = await application.auth.generateLink();
    const link = `${href}/${linkTail}`;
    await application.auth.insertLink(user.id, link);
    const subject = '[FindYourAnimal] Please confirm your registration';
    const message = `    
You can use the following link to confirm your registration:
    
${link}

If you don’t use this link within an hour, it will expire.

Thanks,
FindYourAnimal`;

    await application.mailer.message({ to: email, subject, message });
    return true;
  },
});
