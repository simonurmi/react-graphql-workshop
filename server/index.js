const { ApolloServer, ApolloError, gql } = require('apollo-server');
const {
  createTweet,
  deleteTweet,
  getAllTweets,
  getTweetById,
  getTweetsFrom,
} = require('./db/tweets');
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
} = require('./db/users');

const typeDefs = gql`
  type Mutation {
    createTweet(from: String!, tweet: String!): Tweet
    deleteTweet(id: ID!): Tweet
    createUser(
      username: String!
      email: String!
      displayName: String
      bio: String
      photo: String
    ): User
    updateUser(
      username: String!
      email: String
      displayName: String
      bio: String
      photo: String
    ): User!
    deleteUser(id: ID!): User
  }
  type Query {
    tweet(id: ID!): Tweet
    tweets: [Tweet!]!
    user(username: String!): User
    users: [User!]! # Please return always an array!
  }

  type Tweet {
    id: ID!
    createdAt: String!
    tweet: String!
    from: User!
  }

  type User {
    id: ID!
    createdAt: String!
    username: String!
    displayName: String
    bio: String
    email: String!
    photo: String
    tweets: [Tweet!]!
  }
`;

const resolvers = {
  Mutation: {
    createTweet: (obj, args) => {
      try {
        createTweet(args).catch(error => {
          throw new ApolloError(error);
        });
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    createUser: (obj, args) => createUser(args),
    deleteTweet: (obj, args) => deleteTweet(args),
    deleteUser: (obj, args) => deleteUser(args),
    updateUser: (obj, args) => updateUser(args),
  },
  Query: {
    tweet: (obj, args) => getTweetById(args.id),
    tweets: () => getAllTweets(),
    user: (obj, args) => getUserByUsername(args.username),
    users: () => getAllUsers(),
  },
  Tweet: {
    from: obj => getUserByUsername(obj.from),
  },
  User: {
    tweets: obj => getTweetsFrom(obj.username),
  },
};

const server = new ApolloServer({ resolvers, typeDefs });

server.listen().then(server => console.log(`Server started at ${server.url}`));
