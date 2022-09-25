
import { where } from 'firebase/firestore';
import Link from 'next/link';
import { Container } from 'react-bootstrap'
import { uiDateFormat } from '../components/ui/uiUtils';
import { getDocument, queryOnce } from '../firebase/firestore';
import { User } from '../firebase/types';
import { PostType } from './account/editpost';
import { PostDisplayType } from './posts/[id]';

export default function Home({ data, posts }) {

  return (
    <>
      <Container>
        <div className="p-4 p-md-5 mb-4 rounded text-bg-dark">
          <div className="col-md-6 px-0">
            <h1 className="display-4 fst-italic">{data.heroTextMain}</h1>
            <p className="lead my-3">{data.heroTextDesc}</p>
            <p className="lead mb-0"><a href="#" className="text-white fw-bold">Continue reading...</a></p>
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6">
            <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
              <div className="col p-4 d-flex flex-column position-static">
                <strong className="d-inline-block mb-2 text-primary">World</strong>
                <h3 className="mb-0">Featured post</h3>
                <div className="mb-1 text-muted">Nov 12</div>
                <p className="card-text mb-auto">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                <a href="#" className="stretched-link">Continue reading</a>
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
        </div>

        <div className="row g-5">
          <div className="col-md-8">
            <h3 className="pb-4 mb-4 fst-italic border-bottom">
              From the Firehose
            </h3>

            {[...posts].map((x: PostDisplayType, i) =>
              <article key={x.id} className="blog-post">
                <h2 className="blog-post-title mb-1">{x.title}</h2>
                <p className="blog-post-meta">{x.formattedUpdateDate} by <a href={`users/${x.userId}`}>{x.authorName}</a></p>
                <p>{x.intro}</p>
                <p><a href={`posts/${x.id}`}>Read more</a></p>
                <hr />
                <p>This is some additional paragraph placeholder content. It&apos;s a slightly shorter version of the other highly repetitive body text used throughout.</p>
              </article>
            )}
            <nav className="blog-pagination" aria-label="Pagination">
              <a className="btn btn-outline-primary rounded-pill" href="#">Older</a>
              <a className="btn btn-outline-secondary rounded-pill disabled">Newer</a>
            </nav>

          </div>

          <div className="col-md-4">
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
          </div>
        </div>

      </Container>
    </>
  )
}

/**
 * This function gets called at build time on server-side.
 * It won't be called on client-side
 */
export async function getStaticProps() {
  const resp = await getDocument({path: 'appconfig', pathSegments:['homepage']});
  const posts = await queryOnce<PostType>({ path: `posts`, queryConstraints: [where("public", "==", true)] })
  const postDisplay = new Array<PostDisplayType>();
  const userLookup = {};
  for (const post of posts) {
    if (!userLookup[post.userId]){
      const userInfo = await getDocument({path: 'users', pathSegments:[post.userId]});
      userLookup[post.userId] = userInfo;
    }
    postDisplay.push({...post, formattedUpdateDate: uiDateFormat(post.updateDate), authorName: userLookup[post.userId]['name']})
  }

  return {
    props: {
      data: resp,
      posts: postDisplay
    }
  }
}
