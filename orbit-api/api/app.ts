import { use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';
import { auth } from 'nexus-plugin-jwt-auth';

const protectedPaths = ['Query.inventoryItems'];

use(
  prisma({
    client: {
      options: {
        errorFormat: 'minimal'
      }
    },
    features: { crud: true }
  })
);
use(
  auth({
    appSecret: 'secret123',
    protectedPaths
  })
);
