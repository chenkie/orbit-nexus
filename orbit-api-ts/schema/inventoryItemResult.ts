import { objectType } from '@nexus/schema';

export const InventoryItemResult = objectType({
  name: 'InventoryItemResult',
  definition(t) {
    t.string('message');
    t.field('inventoryItem', {
      type: 'InventoryItem'
    });
  }
});
