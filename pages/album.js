import React from 'react';
import Album from '../src/templates/album/Album';

const Albumpage = props => (
    <Album />
);

Albumpage.getInitialProps = async function() {
  return {};
}

export default Albumpage;
