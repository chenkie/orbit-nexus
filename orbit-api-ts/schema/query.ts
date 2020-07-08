import { objectType } from '@nexus/schema';
import dashboardData from './../data/dashboard';
import User from './../data/User';
import InventoryItem from './../data/InventoryItem';

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('dashboardData', {
      type: 'DashboardData',
      async resolve() {
        return dashboardData;
      }
    });
    t.list.field('users', {
      type: 'User',
      async resolve() {
        try {
          return await User.find()
            .lean()
            .select('_id firstName lastName avatar bio');
        } catch (err) {
          return err;
        }
      }
    });
    t.field('user', {
      type: 'User',
      async resolve() {
        try {
          const user = '5ec17dc465a5f7472f99deb0';
          return await User.findOne({ _id: user })
            .lean()
            .select(
              '_id firstName lastName role avatar bio'
            );
        } catch (err) {
          return err;
        }
      }
    });
    t.list.field('inventoryItems', {
      type: 'InventoryItem',
      async resolve() {
        try {
          const user = '5ec17dc465a5f7472f99deb0';
          return await InventoryItem.find({
            user: user
          });
        } catch (err) {
          return err;
        }
      }
    });
    t.field('userBio', {
      type: 'UserBio',
      async resolve(t) {
        try {
          const user = '5ec17dc465a5f7472f99deb0';
          const foundUser: any = await User.findOne({
            _id: user
          })
            .lean()
            .select('bio');

          return { bio: foundUser.bio };
        } catch (err) {
          return err;
        }
      }
    });
  }
});
