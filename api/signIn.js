({
  access: 'public',
  method: async ({ email, password }) => {
    const user = await application.auth.getUserByEmail(email);
    const hash = user ? user.password : undefined;
    const valid = await application.security.validatePassword(password, hash);
    if (!user || !valid) return false;
    return { result: 'success', userId: user.id };
  },
});
