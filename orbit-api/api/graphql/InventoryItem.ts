import { schema } from 'nexus';

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
    t.crud.inventoryItems();
    t.crud.inventoryItem();
  }
});

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.crud.createOneInventoryItem({
      computedInputs: {
        image: () =>
          'https://images.unsplash.com/photo-1580169980114-ccd0babfa840?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9'
      }
    });
    t.crud.deleteOneInventoryItem();
  }
});
