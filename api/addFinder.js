async ({ phone, description, location, age, email, whome }) => {
  const user = await application.auth.addPetFinder(email, {
    phone,
    description,
    location,
    whome,
    age,
  });
  return { result: 'success', userEmail: user.userEmail };
};
