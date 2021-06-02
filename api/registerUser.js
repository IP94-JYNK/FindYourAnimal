({
  access: 'public',
  method: async ({ password, name, email }) => {
    const hash = await application.security.hashPassword(password);
    const exist = await application.functional.registerUser(hash, name, email);
    if (exist) return { denied: exist.field };
    return { result: 'success' };
  },
});
