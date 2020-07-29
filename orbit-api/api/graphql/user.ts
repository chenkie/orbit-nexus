import { schema } from 'nexus';
import {
  hashPassword,
  verifyPassword,
  createToken,
  getDecodedToken
} from '../../util';
import { stringArg } from 'nexus/components/schema';

schema.objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('role');
    t.string('avatar', { nullable: true });
    t.string('bio', { nullable: true });
    t.string('password');
  }
});

schema.objectType({
  name: 'UserSignupResult',
  definition(t) {
    t.string('message');
    t.field('userInfo', {
      type: 'UserInfo'
    });
    t.string('token');
    t.string('expiresAt');
  }
});

schema.objectType({
  name: 'UserLoginResult',
  definition(t) {
    t.string('message');
    t.field('userInfo', {
      type: 'UserInfo'
    });
    t.string('token');
    t.string('expiresAt');
  }
});

schema.objectType({
  name: 'UserBio',
  definition(t) {
    t.string('bio');
  }
});

schema.objectType({
  name: 'UserUpdateResult',
  definition(t) {
    t.string('message');
    t.field('user', {
      type: 'UserInfo'
    });
  }
});

schema.objectType({
  name: 'UserInfo',
  definition(t) {
    t.id('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('role');
    t.string('avatar');
    t.string('bio');
  }
});

schema.extendType({
  type: 'Query',
  definition(t) {
    t.crud.users();
    t.field('user', {
      type: 'User',
      async resolve(parent, args, context) {
        const user = await context.db.user.findOne({
          where: {
            id: context.token.sub
          }
        });

        if (!user) {
          throw new Error('User not found');
        }
        return user;
      }
    });
  }
});

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: 'UserSignupResult',
      args: {
        firstName: stringArg({ required: true }),
        lastName: stringArg({ required: true }),
        email: stringArg({ required: true }),
        password: stringArg({ required: true })
      },
      resolve: async (parent, args, context) => {
        try {
          const hashedPassword: string = await hashPassword(
            args.password
          );

          const user = await context.db.user.create({
            data: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              role: 'admin',
              password: hashedPassword,
              avatar: 'https://github.com/chenkie.png',
              bio: ''
            }
          });

          const {
            id,
            firstName,
            lastName,
            email,
            role,
            avatar,
            bio
          } = user;

          const token = createToken({
            id,
            firstName,
            lastName,
            role,
            avatar,
            email
          });

          const expiresAt = getDecodedToken(token).exp;

          return {
            message: 'Signup successful!',
            userInfo: {
              id,
              firstName,
              lastName,
              email,
              role,
              bio,
              avatar
            },
            token,
            expiresAt
          };
        } catch (err) {
          if (err.code === 'P2002') {
            throw new Error('Email already exists');
          }
          throw new Error('Something went wrong');
        }
      }
    });
    t.field('login', {
      type: 'UserLoginResult',
      args: {
        email: stringArg({ required: true }),
        password: stringArg({ required: true })
      },
      async resolve(parent, args, context) {
        try {
          const foundUser = await context.db.user.findOne({
            where: {
              email: args.email
            }
          });

          if (!foundUser) {
            throw new Error('Wrong email or password');
          }

          const passwordValid = await verifyPassword(
            args.password,
            foundUser.password
          );

          if (passwordValid) {
            const {
              id,
              firstName,
              lastName,
              email,
              role,
              bio,
              avatar
            } = foundUser;

            const token = createToken({
              id,
              firstName,
              lastName,
              role,
              avatar,
              email
            });

            const expiresAt = getDecodedToken(token).exp;

            return {
              message: 'Authentication successful!',
              userInfo: {
                id,
                firstName,
                lastName,
                email,
                role,
                bio,
                avatar
              },
              token,
              expiresAt
            };
          }
        } catch (err) {
          throw new Error(err);
        }
      }
    });
    t.field('updateUserBio', {
      type: 'UserUpdateResult',
      args: { bio: stringArg({ required: true }) },
      async resolve(parent, args, context) {
        const updatedUser = await context.db.user.update({
          where: {
            id: context.token.sub
          },
          data: {
            bio: args.bio
          }
        });

        return {
          message: 'User bio updated',
          userInfo: {
            bio: updatedUser.bio
          }
        };
      }
    });
    t.field('updateUserRole', {
      type: 'UserUpdateResult',
      args: {
        role: stringArg({ required: true })
      },
      async resolve(parent, args, context) {
        const updatedUser = await context.db.user.update({
          where: {
            id: context.token.sub
          },
          data: {
            role: args.role
          }
        });
        return {
          message:
            'User role updated! You must log out and then back in for the changes to take effect.',
          user: updatedUser
        };
      }
    });
  }
});
