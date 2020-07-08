import mongoose, { Schema } from 'mongoose';
const MongooseSchema = mongoose.Schema;

const userModel: Schema = new MongooseSchema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  bio: { type: String, required: false }
});

const User = mongoose.model('user', userModel);

export default User;
