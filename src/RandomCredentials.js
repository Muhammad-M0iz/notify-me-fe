export default function RandomCredentials() {
  const randomString = Math.random().toString(36).substring(2, 10);
  const email = `guest_${randomString}@example.com`; // Ensuring valid email
  const password = Math.random().toString(36).substring(2, 12); // At least 10 characters
  console.log(email, password);
  return { email, password };
}
