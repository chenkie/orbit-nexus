import { objectType } from '@nexus/schema';

export const UserType = objectType({
  name: 'User',
  definition(t) {
    t.id('_id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('role');
    t.string('avatar', { nullable: true });
    t.string('bio', { nullable: true });
  }
});
