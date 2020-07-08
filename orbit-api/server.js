require('dotenv').config();
const jwtDecode = require('jwt-decode');
const mongoose = require('mongoose');
const dashboardData = require('./data/dashboard');
const User = require('./data/User');
const InventoryItem = require('./data/InventoryItem');
const path = require('path');
const {
  createToken,
  hashPassword,
  verifyPassword
} = require('./util');
const {
  ApolloServer,
  ApolloError,
  UserInputError
} = require('apollo-server');
const {
  objectType,
  makeSchema,
  stringArg,
  floatArg,
  idArg
} = require('@nexus/schema');

const Sale = objectType({
  name: 'Sale',
  definition(t) {
    t.string('date');
    t.int('amount');
  }
});

const DashboardData = objectType({
  name: 'DashboardData',
  definition(t) {
    t.int('salesVolume');
    t.int('newCustomers');
    t.int('refunds');
    t.list.field('graphData', { type: 'Sale' });
  }
});

const UserType = objectType({
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

const InventoryItemType = objectType({
  name: 'InventoryItem',
  definition(t) {
    t.id('_id');
    t.string('user');
    t.string('name');
    t.string('itemNumber');
    t.string('unitPrice');
    t.string('image');
  }
});

const UserBioType = objectType({
  name: 'UserBio',
  definition(t) {
    t.string('bio');
  }
});

const AuthenticationResult = objectType({
  name: 'AuthenticationResult',
  definition(t) {
    t.string('message');
    t.field('userInfo', { type: 'User' });
    t.string('token');
    t.string('expiresAt');
  }
});

const InventoryItemResult = objectType({
  name: 'InventoryItemResult',
  definition(t) {
    t.string('message');
    t.field('inventoryItem', {
      type: 'InventoryItem'
    });
  }
});

const UserUpdateResult = objectType({
  name: 'UserUpdateResult',
  definition(t) {
    t.string('message');
    t.field('user', {
      type: 'User'
    });
  }
});

const UserBioUpdateResult = objectType({
  name: 'UserBioUpdateResult',
  definition(t) {
    t.string('message');
    t.field('userBio', { type: 'UserBio' });
  }
});

const Query = objectType({
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
          const foundUser = await User.findOne({
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

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('login', {
      type: 'AuthenticationResult',
      args: { email: stringArg(), password: stringArg() },
      async resolve(_, args) {
        try {
          const { email, password } = args;

          const user = await User.findOne({
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

            const decodedToken = jwtDecode(token);
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
        email: stringArg(),
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
          const savedUser = await newUser.save();

          if (savedUser) {
            const token = createToken(savedUser);
            const decodedToken = jwtDecode(token);
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
        role: stringArg()
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
          const updatedUser = await User.findOneAndUpdate(
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

const schema = makeSchema({
  types: [
    AuthenticationResult,
    UserType,
    DashboardData,
    Sale,
    InventoryItemType,
    InventoryItemResult,
    UserBioType,
    UserUpdateResult,
    UserBioUpdateResult,
    Query,
    Mutation
  ],
  outputs: {
    schema: path.join(__dirname, '../orbit.graphql')
  }
});

const server = new ApolloServer({
  schema
});

async function connect() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  } catch (err) {
    console.log('Mongoose error', err);
  }
  server.listen(3001).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
}

connect();
