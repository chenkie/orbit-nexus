import { objectType } from '@nexus/schema';

export const UserBio = objectType({
  name: 'UserBio',
  definition(t) {
    t.string('bio');
  }
});
