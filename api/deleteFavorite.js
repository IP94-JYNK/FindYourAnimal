async (UserEmail, FavoriteEmail) => {
  const user = await application.auth.getUserByEmail(UserEmail);
  const favorites = user.favorites;
  const position = favorites.indexOf(FavoriteEmail);
  favorites.splice(position, 1);

  await application.auth.deleteFavorite(favorites, UserEmail);
  return { result: 'success' };
};
