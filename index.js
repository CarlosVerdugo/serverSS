import "dotenv/config"

import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import mongoose from "mongoose"
import express from 'express';

import { types, inputs, queries, mutations } from "./typedefs/index.js"

import resolvers from "./resolver/queryResolver.js"

let typeDefs = `#graphql

  ${types}

  ${inputs}

  ${queries}
  ${mutations}
`

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();
server.applyMiddleware({ app });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB', err));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor Apollo en ejecución en http://localhost:${PORT}/graphql`);
});
