async ({ search }) => {
  const owners = await application.auth.searchOwner(`*${search}*`);
  return { result: 'success', owners };
};
