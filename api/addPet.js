async ({ alias, type, species, age, email, description, sex }) => {
  const user = await application.auth.addPet(email, {
    alias,
    type,
    species,
    description,
    age,
    sex,
  });
  return { result: 'success', userEmail: user.ownerEmail };
};
