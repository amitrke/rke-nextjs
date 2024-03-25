
import { limit, or, orderBy, where } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap'
import { getImageDownloadURL, ShowImageRaw } from '../components/ui/showImage';
import { uiDateFormat, uiRound } from '../components/ui/uiUtils';
import { getDocument, queryOnce } from '../firebase/firestore';
import { PostType } from './account/editpost';
import { PostDisplayType } from './posts/[id]';
import { Weather } from './weather/[id]';
import Head from 'next/head';
import HeadTag from '../components/ui/headTag';
import { getPostsWithDetails } from '../service/PostService';

export default function Home({ data, posts, cacheCreatedAt }) {

  const [weather, setWeather] = useState({} as Weather)
  const [weatherText, setWeatherText] = useState('' as string)
  const [weatherImg, setWeatherImg] = useState('' as string)

  useEffect(() => {
    getDocument<Weather>({ path: `weather`, pathSegments: ['roorkee-in'] }).then((w: Weather) => {
      setWeather(w);
    })
  }, []);

  useEffect(() => {
    if (weather.current) {
      setWeatherText(`${uiRound(weather.current.temp, 1)}°C, ${weather.current.weather[0].description}`);
      setWeatherImg('https://openweathermap.org/img/wn/' + weather.current.weather[0].icon + '@2x.png');
    }
  }, [weather]);

  return (
    <>
      <HeadTag title="Roorkee.org: Town Information." description="Roorkee.org: Town Information." />
      <Container>
        <div className="p-4 p-md-5 mb-4 rounded text-bg-dark">
          <div className="jumbotron col-md-10 px-0">
            <h1 className="display-4 fst-italic">{weatherText}<Image className='d-none d-md-inline' src={weatherImg} /></h1>
            <p className="lead my-3">{data.heroTextDesc}</p>
            <p className="lead mb-0"><Link href="/weather/roorkee-in" className="text-white fw-bold">Detailed weather forcast...</Link></p>
          </div>
        </div>

        <Row className="mb-2">
          <div className="col-md-6">
            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div className="col p-4 d-flex flex-column position-static">
                <strong className="d-inline-block mb-2 text-primary">World</strong>
                <h3 className="mb-0">Photo Albums</h3>
                <div className="mb-1 text-muted">Nov 12</div>
                <p className="card-text mb-auto">Discover and upload awesome pictures of this beautiful town</p>
                <Link href="/albums/" className="stretched-link">Continue to albums</Link>
              </div>
              <div className="col-auto d-none d-lg-block">
                <svg className="bd-placeholder-img" width="200" height="250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>

              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div className="col p-4 d-flex flex-column position-static">
                <strong className="d-inline-block mb-2 text-success">Design</strong>
                <h3 className="mb-0">Post title</h3>
                <div className="mb-1 text-muted">Nov 11</div>
                <p className="mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                <a href="#" className="stretched-link">Continue reading</a>
              </div>
              <div className="col-auto d-none d-lg-block">
                <svg className="bd-placeholder-img" width="200" height="250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>

              </div>
            </div>
          </div>
        </Row>

        <Row className="g-5 text-black">
          <Col md={8}>
            <h3 className="pb-4 mb-4 fst-italic border-bottom">
              From the Firehose
            </h3>

            {[...posts].map((x: PostDisplayType, i) =>
              <Link key={x.id} href={`post/${x.category}/${x.slug}`} style={{ textDecoration: 'none' }}>
                <Row className="blog-post">
                  <Col md={8}>
                    <h2 className="blog-post-title mb-1 text-black">{x.title}</h2>
                    <p className="blog-post-meta">Posted on {x.formattedUpdateDate} by {x.author.name}</p>
                    <p className='text-black'>
                      {x.intro}
                    </p>
                  </Col>
                  <Col md={4}>
                    <ShowImageRaw size="s" imageUrl={x.images[0]} classes="img-thumbnail imgshadow" />
                  </Col>
                  <hr />
                </Row>
              </Link>
            )}
            <nav className="blog-pagination" aria-label="Pagination">
              <a className="btn btn-outline-primary rounded-pill" href="#">Older</a>
              <a className="btn btn-outline-secondary rounded-pill disabled">Newer</a>
            </nav>

          </Col>

          <Col md={4}>
            <div className="position-sticky">
              <div className="p-4 mb-3 bg-light rounded">
                <h4 className="fst-italic">About</h4>
                <p className="mb-0">Born in 2001, this website is a personal project to bring people of this town together, not affiliated to government / corporation.</p>
              </div>

              <div className="p-4">
                <h4 className="fst-italic">Recent Posts</h4>
                <ol className="list-unstyled mb-0">
                  <li><Link href="/posts/m3BbY0r1SfDprLkyUJc6">IIT Roorkee</Link></li>
                  <li><a href="#">February 2021</a></li>
                </ol>
              </div>

              <div className="p-4">
                <h4 className="fst-italic">Elsewhere</h4>
                <ol className="list-unstyled">
                  <li><a href="#">GitHub</a></li>
                  <li><a href="#">Twitter</a></li>
                  <li><a href="#">Facebook</a></li>
                </ol>
              </div>
            </div>
          </Col>
        </Row >
        <Row>
          <Col>
            <hr />
            <p className="text-center">This page was generated at {cacheCreatedAt}</p>
          </Col>
        </Row>
      </Container >
    </>
  )
}

/**
 * This function gets called at build time on server-side.
 * It won't be called on client-side
 */
export async function getStaticProps() {
  const resp = await getDocument({ path: 'appconfig', pathSegments: ['homepage'] });
  const postDisplay = await getPostsWithDetails();
  const cacheCreatedAt = uiDateFormat((new Date()).getTime());
  return {
    props: {
      data: resp,
      posts: postDisplay,
      cacheCreatedAt
    },
    revalidate: 86400, // regenerate page every 24 hours
  }
}
