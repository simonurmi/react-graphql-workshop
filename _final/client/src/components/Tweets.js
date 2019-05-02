import React, { memo } from 'react';
import Tweet from './Tweet';

const Tweets = ({ loading, me, tweets }) => (tweets.length > 0
  ? tweets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(tweet => (
      <Tweet
        key={tweet.id}
        loading={loading}
        canDelete={me.id === tweet.from.id}
        id={tweet.id}
        tweet={tweet.tweet}
        from={tweet.from}
      />
    ))
  : 'No tweets yet.');

export default memo(Tweets);
