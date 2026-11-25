const normalize = (email) => email.trim().toLowerCase();

export const findByEmail = (accounts, email) =>
  accounts.find((account) => normalize(account.email) === normalize(email));

/** The account with these credentials, or undefined. */
export function authenticate(accounts, { email, password }) {
  const account = findByEmail(accounts, email);
  return account?.password === password ? account : undefined;
}

/** What the store shows of an account: everything but the password. */
export function toUser(account) {
  if (!account) return null;
  const user = { ...account };
  delete user.password;
  return user;
}
