({
  access: 'public',
  method: async ({ password, name, email, favorites }) => {
    const hash = await application.security.hashPassword(password);
    const exist = await application.auth.registerUser(hash, name, email, favorites);
    if (exist) return { denied: exist.field };
    return { result: 'success' };
  },
});
