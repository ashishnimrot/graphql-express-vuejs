const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const MyGraphQLSchema = require('./schema/schema')
// const mongoose = require('mongoose')

const app = express();

// mongoose.connect('');
// mongoose.connection.once('open',() => {
//     console.log('Connected to database');
// })

app.use(
  '/graphql',
  graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true,
  }),
);

app.listen(5000);