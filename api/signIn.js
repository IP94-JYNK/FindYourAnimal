({
  access: 'public',
  method: async ({ email, password }) => {
    const user = await application.auth.getUser(email);
    const hash = user ? user.password : undefined;
    const valid = await application.security.validatePassword(password, hash);
    if (!user || !valid) return false;
    console.log(`Logged user: ${email}`);
    return { result: 'success', userId: user.id };
  },
});
