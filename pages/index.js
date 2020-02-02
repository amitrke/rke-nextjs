import React from "react";
import PubCache from "../src/services/pubcache";
import { getPost } from "../src/services/firebasedb";
import { CssBaseline, Container, Grid, makeStyles } from "@material-ui/core";
import Header from "../src/templates/blog/Header";
import MainFeaturedPost from "../src/templates/blog/MainFeaturedPost";
import FeaturedPost from "../src/templates/blog/FeaturedPost";
import Main from "../src/templates/blog/Main";
import Sidebar from "../src/templates/blog/Sidebar";

import GitHubIcon from "@material-ui/icons/GitHub";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";
import Footer from "../src/templates/blog/Footer";

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(3)
  }
}));

const sections = [
  { title: "Photo Gallery", url: "/album" },
  { title: "Design", url: "#" },
  { title: "Culture", url: "#" },
  { title: "Business", url: "#" },
  { title: "Politics", url: "#" },
  { title: "Opinion", url: "#" },
  { title: "Science", url: "#" },
  { title: "Health", url: "#" },
  { title: "Style", url: "#" },
  { title: "Travel", url: "#" }
];

const mainFeaturedPost = {
  title: "2020 RKE",
  description:
    "Welcome to the refreshing new Roorkee.org website, Developers are welcome to contribute.",
  image: "https://source.unsplash.com/random",
  imgText: "main image description",
  linkText: "Continue reading…"
};

const featuredPosts = [
  {
    title: "Photo Gallery",
    date: "Jan 20",
    description: "Discover and upload awesome pictures of this beautiful town",
    image: "https://source.unsplash.com/500x400/?india,ganges",
    imageText: "Photogallery",
    link: "/album"
  },
  {
    title: "Town News",
    date: "Jan 12",
    description:
      "Updated daily, get to know what's happening in town, IIT and nearby areas.",
    image: "https://source.unsplash.com/500x400/?news,newspaper",
    imageText: "Image Text",
    link: "#"
  }
];

const sidebar = {
  title: "About",
  description:
    "Born in 2001, this website is a personal project to bring people of this town together, not affiliated to government/corporation.",
  archives: [
    { title: "March 2020", url: "#" },
    { title: "February 2020", url: "#" },
    { title: "January 2020", url: "#" },
    { title: "November 1999", url: "#" },
    { title: "October 1999", url: "#" },
    { title: "September 1999", url: "#" },
    { title: "August 1999", url: "#" },
    { title: "July 1999", url: "#" },
    { title: "June 1999", url: "#" },
    { title: "May 1999", url: "#" },
    { title: "April 1999", url: "#" }
  ],
  social: [
    { name: "GitHub", icon: GitHubIcon },
    { name: "Twitter", icon: TwitterIcon },
    { name: "Facebook", icon: FacebookIcon }
  ]
};

const Index = props => {
  const post1 = props.post1;
  const posts = [post1];

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
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </React.Fragment>
  );
};

Index.getInitialProps = async function() {
  let postBody = await getPost("aboutrke");
  return { post1: postBody.body };
};

export default Index;
