import "dotenv/config"

import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import mongoose from "mongoose"

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
  resolvers,
  cors: {
    origin: "*", // Reemplaza con tu dominio público
    credentials: true, // Si es necesario para tu aplicación
  },
});

mongoose.connect(process.env.MONGODB_CONN, {useNewUrlParser: true})
  .then(() => {
    console.log("[📥] MongoDB Connection successful");
    return startStandaloneServer(server, {
      listen: {
        port: process.env.PORT,
      },
    })
  })
  .then(({url}) => {
    console.log(`[🚀] Server running at ${url}`);
  })
