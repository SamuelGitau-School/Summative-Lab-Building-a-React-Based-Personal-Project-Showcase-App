import { getCollection, setCollection } from '../../Database/db/Localdb';

function fakeToken(userId) {
  return btoa(`${userId}-${Date.now()}`);
}

export async function login(email, password) {
  const users = getCollection('users', []);
  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) {
    throw new Error('Invalid email or password.');
  }

  const { password: _pw, ...safeUser } = found;
  return { token: fakeToken(found.id), user: safeUser };
}

export async function signup({ username, firstName, lastName, email, password }) {
  const users = getCollection('users', []);

  if (users.some((u) => u.email === email)) {
    throw new Error('An account with that email already exists.');
  }

  const newUser = {
    id: Date.now(),
    username,
    firstName,
    lastName,
    email,
    password,
    role: 'customer',
  };

  users.push(newUser);
  setCollection('users', users);

  const { password: _pw, ...safeUser } = newUser;
  return { token: fakeToken(newUser.id), user: safeUser };
}