import React from 'react';
import PubCache from '../src/services/pubcache';
import Blog from '../src/templates/blog/Blog';

const Index = props => (
    <Blog />
);

Index.getInitialProps = async function() {
  return PubCache();
}

export default Index;
