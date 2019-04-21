const { ApolloError, PubSub } = require('apollo-server');
const {
  createTweet,
  deleteTweet,
  getAllTweets,
  getTweetsFrom,
  getTweetById,
} = require('./db/tweets');
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserByUsername,
} = require('./db/users');

const pubsub = new PubSub();
const TWEET_CREATED = 'TWEET_CREATED';

const resolvers = {
  Mutation: {
    createTweet: async (_, args) => {
      try {
        const tweet = await createTweet(args);
        pubsub.publish(TWEET_CREATED, { tweetCreated: tweet });
        return tweet;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    deleteTweet: async (_, args) => {
      try {
        return deleteTweet(args);
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    createUser: async (_, args) => {
      try {
        return createUser(args);
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    updateUser: async (_, args) => {
      try {
        return updateUser(args);
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    deleteUser: async (_, args) => {
      try {
        return deleteUser(args);
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },

  Query: {
    me: (_, args, context) => getUserByUsername(context.user),
    tweet: (_, args) => getTweetById(args.id),
    tweets: () => getAllTweets(),
    users: () => getAllUsers(),
    user: (_, args) => getUserByUsername(args.username),
  },

  Subscription: {
    tweetCreated: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator(TWEET_CREATED),
    },
  },

  Tweet: {
    from: obj => getUserByUsername(obj.from),
  },

  User: {
    email: (obj, args, context) =>
      context.user === obj.username ? obj.email : null,
    tweets: obj => getTweetsFrom(obj.username),
  },
};

module.exports = resolvers;
