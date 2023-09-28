import "dotenv/config"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import mongoose from "mongoose"
import { types, inputs, queries, mutations } from "./typedefs/index.js"
import resolvers from "./resolver/queryResolver.js"
import jwt from 'jsonwebtoken';

let typeDefs = `#graphql
  scalar JSON
  scalar Date
  ${types}
  ${inputs}
  ${queries}
  ${mutations}
`

// Auth middleware function
function auth({ req }) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log(decoded.user)
      return { user: decoded.user };
    } catch (err) {
      console.error(err);
    }
  }

  return{};
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: auth,
  cors: {
    origin: "serverss-production.up.railway.app", // Reemplaza con tu dominio público
    credentials: true, // Si es necesario para tu aplicación
  },
  introspection: true
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
