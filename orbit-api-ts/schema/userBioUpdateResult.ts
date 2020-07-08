import { objectType } from '@nexus/schema';

export const UserBioUpdateResult = objectType({
  name: 'UserBioUpdateResult',
  definition(t) {
    t.string('message');
    t.field('userBio', { type: 'UserBio' });
  }
});
