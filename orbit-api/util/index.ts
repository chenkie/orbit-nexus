import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as jwtDecode from 'jwt-decode';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar: string;
  email: string;
}

export const createToken = (user: User) => {
  // Sign the JWT
  if (!user.role) {
    throw new Error('No user role specified');
  }
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      iss: 'api.orbit',
      aud: 'api.orbit'
    },
    'secret123',
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};

export const hashPassword = (
  password: any
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 12 strength
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const verifyPassword = (
  passwordAttempt: string,
  hashedPassword: string
) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};

export const getDecodedToken = (token: string): any =>
  jwtDecode(token);
