import {
  objectType,
  stringArg,
  idArg,
  floatArg
} from '@nexus/schema';
import User from './../data/User';
import InventoryItem from './../data/InventoryItem';
import { ApolloError, UserInputError } from 'apollo-server';
import {
  createToken,
  hashPassword,
  verifyPassword
} from './../util';
import jwtDecode from 'jwt-decode';

interface tokenDto {
  sub: string;
  exp: string;
}

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('login', {
      type: 'AuthenticationResult',
      args: {
        email: stringArg({ required: true }),
        password: stringArg({ required: true })
      },
      async resolve(_, args) {
        try {
          const { email, password } = args;

          const user: any = await User.findOne({
            email
          }).lean();

          if (!user) {
            throw new UserInputError(
              'Wrong email or password'
            );
          }

          const passwordValid = await verifyPassword(
            password,
            user.password
          );

          if (passwordValid) {
            const { password, bio, ...rest } = user;
            const userInfo = Object.assign({}, { ...rest });

            const token = createToken(userInfo);

            const decodedToken = jwtDecode<tokenDto>(token);
            const expiresAt = decodedToken.exp;

            return {
              message: 'Authentication successful!',
              token,
              userInfo,
              expiresAt
            };
          } else {
            throw new UserInputError(
              'Wrong email or password'
            );
          }
        } catch (err) {
          return err;
        }
      }
    });
    t.field('signup', {
      type: 'AuthenticationResult',
      args: {
        firstName: stringArg(),
        lastName: stringArg(),
        email: stringArg({ required: true }),
        password: stringArg()
      },
      async resolve(_, args) {
        try {
          const {
            firstName,
            lastName,
            email,
            password
          } = args;

          const hashedPassword = await hashPassword(
            password
          );

          const userData = {
            email: email.toLowerCase(),
            firstName,
            lastName,
            password: hashedPassword,
            role: 'admin'
          };

          const existingEmail = await User.findOne({
            email: userData.email
          }).lean();

          if (existingEmail) {
            throw new ApolloError('Email already exists');
          }

          const newUser = new User(userData);
          const savedUser: any = await newUser.save();

          if (savedUser) {
            const token = createToken(savedUser);
            const decodedToken = jwtDecode<tokenDto>(token);
            const expiresAt = decodedToken.exp;

            const {
              _id,
              firstName,
              lastName,
              email,
              role
            } = savedUser;

            const userInfo = {
              _id,
              firstName,
              lastName,
              email,
              role
            };

            return {
              message: 'User created!',
              token,
              userInfo,
              expiresAt
            };
          } else {
            throw new ApolloError(
              'There was a problem creating your account'
            );
          }
        } catch (err) {
          return err;
        }
      }
    });
    t.field('addInventoryItem', {
      type: 'InventoryItemResult',
      args: {
        name: stringArg(),
        itemNumber: stringArg(),
        unitPrice: floatArg()
      },
      async resolve(_, args) {
        try {
          const user = '5ec17dc465a5f7472f99deb0';
          const input = Object.assign({}, args, {
            user: user
          });
          const inventoryItem = new InventoryItem(input);
          const inventoryItemResult = await inventoryItem.save();
          return {
            message: 'Invetory item created!',
            inventoryItem: inventoryItemResult
          };
        } catch (err) {
          return err;
        }
      }
    });
    t.field('deleteInventoryItem', {
      type: 'InventoryItemResult',
      args: { id: idArg() },
      async resolve(_, args) {
        try {
          const user = '5ec17dc465a5f7472f99deb0';
          const { id } = args;
          const deletedItem = await InventoryItem.findOneAndDelete(
            {
              _id: id,
              user: user
            }
          );

          return {
            message: 'Inventory item deleted!',
            inventoryItem: deletedItem
          };
        } catch (err) {
          return err;
        }
      }
    });
    t.field('updateUserRole', {
      type: 'UserUpdateResult',
      args: {
        role: stringArg({ required: true })
      },
      async resolve(_, args) {
        try {
          const user = '5ec17dc465a5f7472f99deb0';
          const { role } = args;
          const allowedRoles = ['user', 'admin'];

          if (!allowedRoles.includes(role)) {
            throw new ApolloError('Invalid user role');
          }
          const updatedUser = await User.findOneAndUpdate(
            { _id: user },
            { role }
          );
          return {
            message:
              'User role updated. You must log in again for the changes to take effect.',
            user: updatedUser
          };
        } catch (err) {
          return err;
        }
      }
    });
    t.field('updateUserBio', {
      type: 'UserBioUpdateResult',
      args: {
        bio: stringArg()
      },
      async resolve(_, args) {
        try {
          const user = '5ec17dc465a5f7472f99deb0';
          const { bio } = args;
          const updatedUser: any = await User.findOneAndUpdate(
            {
              _id: user
            },
            {
              bio
            },
            {
              new: true
            }
          );

          return {
            message: 'Bio updated!',
            userBio: {
              bio: updatedUser.bio
            }
          };
        } catch (err) {
          return err;
        }
      }
    });
  }
});
