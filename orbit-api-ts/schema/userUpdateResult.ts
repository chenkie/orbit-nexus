import { objectType } from '@nexus/schema';

export const UserUpdateResult = objectType({
  name: 'UserUpdateResult',
  definition(t) {
    t.string('message');
    t.field('user', {
      type: 'User'
    });
  }
});
