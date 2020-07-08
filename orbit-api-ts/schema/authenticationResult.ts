import { objectType } from '@nexus/schema';

export const AuthenticationResult = objectType({
  name: 'AuthenticationResult',
  definition(t) {
    t.string('message');
    t.field('userInfo', { type: 'User' });
    t.string('token');
    t.string('expiresAt');
  }
});
