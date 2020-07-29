import { schema } from 'nexus';
import {
  stringArg,
  floatArg
} from 'nexus/components/schema';

schema.objectType({
  name: 'InventoryItem',
  definition(t) {
    t.id('id');
    t.string('user');
    t.string('name');
    t.string('itemNumber');
    t.float('unitPrice');
    t.string('image');
  }
});

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('inventoryItems', {
      type: 'InventoryItem',
      async resolve(parent, args, context) {
        const items = await context.db.inventoryItem.findMany(
          {
            where: {
              userId: context.token.sub
            }
          }
        );

        return items;
      }
    });
    t.crud.inventoryItem();
  }
});

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createInventoryItem', {
      type: 'InventoryItem',
      args: {
        name: stringArg({ required: true }),
        itemNumber: stringArg({ required: true }),
        unitPrice: floatArg({ required: true })
      },
      async resolve(parent, args, context) {
        const { name, itemNumber, unitPrice } = args;
        const image =
          'https://images.unsplash.com/photo-1580169980114-ccd0babfa840?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9';
        return await context.db.inventoryItem.create({
          data: {
            name,
            itemNumber,
            unitPrice,
            image,
            User: {
              connect: {
                id: context.token.sub
              }
            }
          }
        });
      }
    });

    t.field('deleteInventoryItem', {
      type: 'InventoryItem',
      args: {
        id: stringArg({ required: true })
      },
      async resolve(parent, args, context) {
        return await context.db.inventoryItem.delete({
          where: {
            id: args.id
          }
        });
      }
    });
  }
});
