import React, { useState, memo } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import Button from './Button';
import Input from './Input';
import { allTweetsQuery, userQuery } from '../queries';

const Form = styled.form`
  display: flex;
  margin: 24px 0;
`;

const createTweetMutation = gql`
  mutation createTweet($tweet: String!, $from: String!) {
    createTweet(tweet: $tweet, from: $from) {
      id
      tweet
      createdAt
      from {
        id
        username
        displayName
      }
    }
  }
`;

const TweetButton = memo(({ disabled }) => (
  <Button primary disabled={disabled}>
    Tweet
  </Button>
));

const TweetForm = ({ loading, me }) => {
  const [tweet, setTweet] = useState('');

  const onMutationCompleted = () => {
    setTweet('');
  };

  const onInputChange = (event) => {
    setTweet(event.target.value);
  };

  return (
    <Mutation
      mutation={createTweetMutation}
      variables={{ tweet, from: me.username }}
      onCompleted={onMutationCompleted}
      refetchQueries={[
        { query: allTweetsQuery },
        { query: userQuery, variables: { username: me.username } },
      ]}
      awaitRefetchQueries
    >
      {(mutate) => {
        const onFormSubmit = (event) => {
          event.preventDefault();
          mutate();
        };

        return (
          <Form onSubmit={onFormSubmit}>
            <Input onChange={onInputChange} placeholder="What's happening?" value={tweet} />
            <TweetButton disabled={loading || tweet === ''} />
          </Form>
        );
      }}
    </Mutation>
  );
};

export default memo(TweetForm);
