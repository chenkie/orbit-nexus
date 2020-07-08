import mongoose, { Schema } from 'mongoose';
const MongooseSchema = mongoose.Schema;

const inventoryItemModel: Schema = new MongooseSchema({
  user: { type: mongoose.Types.ObjectId, required: true },
  name: { type: String, required: true },
  itemNumber: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  image: {
    type: String,
    required: true,
    default:
      'https://images.unsplash.com/photo-1580169980114-ccd0babfa840?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9'
  }
});

const InventoryItem = mongoose.model(
  'inventory-item',
  inventoryItemModel
);

export default InventoryItem;
