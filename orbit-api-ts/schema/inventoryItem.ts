import { objectType } from '@nexus/schema';

export const InventoryItemType = objectType({
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
