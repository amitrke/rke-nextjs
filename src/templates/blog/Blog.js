import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: 'Technology', url: '#' },
  { title: 'Design', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Business', url: '#' },
  { title: 'Politics', url: '#' },
  { title: 'Opinion', url: '#' },
  { title: 'Science', url: '#' },
  { title: 'Health', url: '#' },
  { title: 'Style', url: '#' },
  { title: 'Travel', url: '#' },
];

const mainFeaturedPost = {
  title: 'We continue to evolve',
  description:
    "Welcome to the refreshing new Roorkee.org website, Developers are welcome to contribute.",
  image: 'https://source.unsplash.com/random',
  imgText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Featured Recipe',
    date: 'Jan 10',
    description:
      'Discover something new to cook from across the world.',
    image: 'https://source.unsplash.com/500x400/?food,recipe',
    imageText: 'Food',
  },
  {
    title: 'Town News',
    date: 'Jan 12',
    description:
      'Updated daily, get to know what\'s happening in town, IIT and nearby areas.',
    image: 'https://source.unsplash.com/500x400/?news,newspaper',
    imageText: 'Image Text',
  },
];

const post1 = `# About the Town

#### Jan 1, 2020 by [Amit](/)

Roorkee, which at one point of time was a small village, has today grown into a well developed town and can well be termed as the intellectual capital of Uttarakhand.

The famous Ganga Canal which was constructed more than 150 years ago can well be said to be the identity of the place. And a very important one too, after all it was from here that Roorkee started its march towards glory and prosperity.

### IIT
IIT is another reason that makes Roorkee a globally recognisable face. It would be of great interest to know that the famed IIT has its genesis in Roorkee College constituted in 1847 with the purpose of providing survey and technical training to the locals for the construction of Ganga Canal.

The institute was elevated to the status of Independent India’s first engineering university in 1949. And on September 21, 2001 Government of India elevated this institute to the level of IIT.
It would not be a misnomer to state that IIT Roorkee is a jewel not only for Roorkee or Uttarakhand, but a pride for the entire nation.

### Cantonment
No description of Roorkee can be complete without the mention of Roorkee Cantonment. One of the oldest cantonments in the country, it is the headquarter of Indian Army’s Bengal Engineering Group and Centre, also popular as Bengal Sappers.
War memorial is another highpoint of Roorkee. Replica of Mahmood’s tower, it is one of the attractions of Roorkee and was built to commemorate the bravery of Subedar Devi Singh and his men who stormed the Ghazni fort in Afghanistan.


Roorkee is also home to several important research centres. Some of the important ones are:

- Central Building Research Institute (Government of India)
- National Institute of Hydrology (M/o of Water Resources, Government of India)
- Irrigation Research Institute (Under State Government)
- Irrigation Design Organisation (Under State Government)
- Government Irrigational Workshop (Under State Government)

Roorkee is also famous for its Drawing and Survey Instrument Industry. Right from the time of British, Roorkee has remained an important place for the manufacture of survey instruments.
Construction of Ganga Canal, coming up of the engineering college, and later the shifting of Bengal Engineering Group and Centre gave much needed boost to the survey instrument industry.
Today there are 75 big, small survey and drawing instrument units which are into production of instruments worth crores of rupees annually.
With the export-oriented industry expecting a boom, the annual export of the industries of Roorkee is expected to touch a whopping Rs. 70 crore mark.
`;
const posts = [post1];

const sidebar = {
  title: 'About',
  description:
    'This website is a personal project to bring people of this town together, not affiliated to government/corporation.',
  archives: [
    { title: 'March 2020', url: '#' },
    { title: 'February 2020', url: '#' },
    { title: 'January 2020', url: '#' },
    { title: 'November 1999', url: '#' },
    { title: 'October 1999', url: '#' },
    { title: 'September 1999', url: '#' },
    { title: 'August 1999', url: '#' },
    { title: 'July 1999', url: '#' },
    { title: 'June 1999', url: '#' },
    { title: 'May 1999', url: '#' },
    { title: 'April 1999', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Twitter', icon: TwitterIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};

export default function Blog() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Roorkee.org" sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map(post => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="From the firehose" posts={posts} />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      <Footer title="Footer" description="Something here to give the footer a purpose!" />
    </React.Fragment>
  );
}
