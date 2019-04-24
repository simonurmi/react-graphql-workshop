import gql from 'graphql-tag';

const userFragment = gql`
  fragment userFragment on User {
    id
    username
    displayName
    photo
  }
`;

export const allTweetsQuery = gql`
  query getAllTweets {
    tweets {
      id
      tweet
      createdAt
      from {
        ...userFragment
      }
    }
  }

  ${userFragment}
`;

export const userQuery = gql`
  query getUser($username: String!) {
    user(username: $username) {
      ...userFragment
      bio
      createdAt
      tweets {
        id
        tweet
        createdAt
        from {
          ...userFragment
        }
      }
    }
  }

  ${userFragment}
`;
