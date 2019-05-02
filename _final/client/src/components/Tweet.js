import gql from 'graphql-tag';
import React, { memo } from 'react';
import { Mutation } from 'react-apollo';
import {
  MessageCircle as Comment,
  RefreshCw as Retweet,
  Share,
  Trash2 as Trash,
} from 'react-feather';
import { Link } from '@reach/router';
import styled from 'styled-components';
import Avatar from './Avatar';
// import Date from './Date';
import { allTweetsQuery, userQuery } from '../queries';

const deleteTweetMutation = gql`
  mutation deleteTweet($id: ID!) {
    deleteTweet(id: $id) {
      id
      tweet
      createdAt
      from {
        id
        username
        displayName
        photo
      }
    }
  }
`;

const Wrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  display: flex;
  padding: 24px 16px;
  margin: 0 -16px;
  transition: 0.4s;

  &:hover {
    background: #f1f1f1;
  }
`;

const Content = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const DisplayName = styled.span`
  color: #000;
  font-weight: bold;
`;

const Info = styled.div`
  color: #bbb;
`;

const StyledLink = styled(Link)`
  color: inherit;
`;

const Message = styled.div`
  font-size: 20px;
  margin: 16px 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 320px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: #bbb;
  margin: 0;
  outline: none;
  padding: 0;

  &:disabled {
    color: #ddd;
  }
`;

const Spacer = styled.div`
  width: 24px;
`;

const Tweet = ({
  canDelete, loading, tweet, from, id,
}) => (
  <Wrapper>
    <Link to={`/${from.username}`}>
      <Avatar src={from.photo} alt={`@${from.username}`} />
    </Link>
    <Content>
      <Info>
        <StyledLink to={`/${from.username}`}>
          <DisplayName>{from.displayName}</DisplayName>
          {` @${from.username}`}
        </StyledLink>
        {' '}
        {/* • <Date date={tweet.createdAt} /> */}
      </Info>
      <Message>{tweet}</Message>
      <Actions>
        <Button disabled>
          <Comment />
        </Button>
        <Button disabled>
          <Retweet />
        </Button>
        <Button disabled>
          <Share />
        </Button>
        {canDelete ? (
          <Mutation
            mutation={deleteTweetMutation}
            variables={{ id }}
            refetchQueries={[
              { query: allTweetsQuery },
              {
                query: userQuery,
                variables: { username: from.username },
              },
            ]}
            awaitRefetchQueries
          >
            {(mutate) => {
              const onConfirm = () => {
                if (window.confirm('Are you sure?')) {
                  mutate();
                }
              };

              return (
                <Button disabled={loading} onClick={onConfirm}>
                  <Trash />
                </Button>
              );
            }}
          </Mutation>
        ) : (
          <Spacer />
        )}
      </Actions>
    </Content>
  </Wrapper>
);

export default memo(Tweet);
