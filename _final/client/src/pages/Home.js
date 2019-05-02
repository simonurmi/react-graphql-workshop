import React, { memo } from 'react';
import { Query } from 'react-apollo';
import Container from '../components/Container';
import Heading from '../components/Heading';
import Loading from '../components/Loading';
import Tweets from '../components/Tweets';
import TweetForm from '../components/TweetForm';
import { allTweetsQuery } from '../queries';

const Home = ({ loading, me }) => (
  <Container>
    <Heading>Home</Heading>
    <TweetForm loading={loading} me={me} />
    <Query query={allTweetsQuery}>
      {({ data, loading: tweetsLoading, error }) => {
        if (tweetsLoading) return <Loading />;
        if (error) return `Error: ${error.message}`;

        const { tweets } = data;

        return <Tweets loading={loading} me={me} tweets={tweets} />;
      }}
    </Query>
  </Container>
);

export default memo(Home);
