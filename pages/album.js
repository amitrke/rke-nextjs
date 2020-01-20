import React from 'react';
import PubCache from '../src/services/pubcache';
import Album from '../src/templates/album/Album';

const Albumpage = props => (
    <Album />
);

Albumpage.getInitialProps = async function() {
  return PubCache();
}

export default Albumpage;
