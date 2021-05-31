async ({ phone, description, location, age, email }) => {
  const user = await application.auth.addPetOwner(email, {
    phone,
    description,
    location,
    age,
  });
  return { result: 'success', userEmail: user.userEmail };
};
