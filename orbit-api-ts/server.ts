require('dotenv').config();
import { makeSchema } from '@nexus/schema';
import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import * as types from './schema';

const port: number = 3002;

const schema = makeSchema({
  types: [types],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/typings.ts'
  }
});

const server: ApolloServer = new ApolloServer({
  schema
});

async function start() {
  try {
    mongoose.Promise = global.Promise;
    await mongoose.connect(process.env.ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    await server.listen(port);
    console.log(`Server listening on localhost:${port}`);
  } catch (err) {
    console.error(err);
  }
}

start();
