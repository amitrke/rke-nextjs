import HeadTag from '../components/ui/headTag';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/IndexDev.module.css';
import { adminGetDocument } from '../firebase/firebaseAdmin';
import { getAlbumsAdmin, getEventsAdmin, getNewsAdmin, getPostsWithDetailsAdmin } from '../service/PostServiceAdmin';
import { CSSProperties, useEffect, useState } from 'react';
import { Weather } from './weather/[id]';
import { uiRound } from '../components/ui/uiUtils';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

import { PostDisplayType } from '../firebase/types';
import { Event, NewsArticle } from '../service/PostService';
import { AlbumType } from '../pages/account/editAlbum';

type HomepageConfig = {
  heroTextDesc: string;
  heroImage?: string;
  heroLink?: string;
};

type IndexDevProps = {
  posts: PostDisplayType[];
  news: NewsArticle[];
  events: Event[];
  albums: AlbumType[];
  data: HomepageConfig;
};

const defaultHomeData: HomepageConfig = {
  heroTextDesc: 'Welcome to our town. Find all the information you need about our vibrant community.',
  heroImage: '',
  heroLink: '',
};

function IndexDev({ posts = [], news = [], events = [], albums = [], data = defaultHomeData }: IndexDevProps) {
  const [weather, setWeather] = useState({} as Weather);
  const [todayWeather, setTodayWeather] = useState({ temp: '', condition: '', icon: '' });
  const [tomorrowWeather, setTomorrowWeather] = useState({ temp: '', condition: '', icon: '' });
  const [weatherLoading, setWeatherLoading] = useState(true);
  const heroImage = data.heroImage?.trim();
  const heroLink = data.heroLink?.trim();
  const hasHeroLink = Boolean(heroLink);
  const heroIsExternalLink = Boolean(heroLink && /^https?:\/\//i.test(heroLink));

  const heroStyle: CSSProperties | undefined = heroImage
    ? {
        backgroundImage: `linear-gradient(rgba(233, 236, 239, 0.88), rgba(233, 236, 239, 0.82)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : undefined;

  useEffect(() => {
    setWeatherLoading(true);
    fetch('/api/weather')
      .then(res => res.json())
      .then(w => {
        setWeather(w);
        setWeatherLoading(false);
      })
      .catch(() => setWeatherLoading(false));
  }, []);

  useEffect(() => {
    if (weather.current?.weather?.[0]) {
      setTodayWeather({
        temp: `${uiRound(weather.current.temp, 0)}°C`,
        condition: weather.current.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
      });
    }
    if (weather.daily?.[1]?.weather?.[0]) {
      setTomorrowWeather({
        temp: `${uiRound(weather.daily[1].temp.day, 0)}°C`,
        condition: weather.daily[1].weather[0].main,
        icon: `https://openweathermap.org/img/wn/${weather.daily[1].weather[0].icon}@2x.png`
      });
    }
  }, [weather]);

  return (
    <>
      <HeadTag
        title="Roorkee.org: Town Information & Community Hub"
        description="Welcome to Roorkee.org - Your community hub for Roorkee town information, news, events, photo galleries, and local stories. Stay connected with fellow Roorkee residents."
        url="/"
        keywords={['Roorkee', 'Roorkee town', 'Roorkee community', 'IIT Roorkee', 'Roorkee news', 'Roorkee events', 'Roorkee photos']}
        image="/og-image.png"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Roorkee.org',
            'url': 'https://www.roorkee.org',
            'logo': 'https://www.roorkee.org/og-image.png',
            'description': 'Community hub for Roorkee town information, news, events, and local stories',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Roorkee.org',
            'url': 'https://www.roorkee.org',
          }
        ]) }}
      />

      <main className="mx-auto w-full max-w-7xl px-4">
        <section className={`${styles.hero} ${hasHeroLink ? styles.heroWithLink : ''}`} style={heroStyle}>
          <div className={styles.heroText}>
            {hasHeroLink ? (
              heroIsExternalLink ? (
                <a href={heroLink} className={styles.heroPrimaryLink}>
                  <h1>Welcome to Roorkee</h1>
                  <p>{data.heroTextDesc}</p>
                </a>
              ) : (
                <Link href={heroLink!} className={styles.heroPrimaryLink}>
                  <h1>Welcome to Roorkee</h1>
                  <p>{data.heroTextDesc}</p>
                </Link>
              )
            ) : (
              <>
                <h1>Welcome to Roorkee</h1>
                <p>{data.heroTextDesc}</p>
                <div className={styles.heroActions}>
                  <Link href="/posts" className={styles.ctaButton}>Explore Posts</Link>
                  <Link href="/albums" className={styles.ctaButtonSecondary}>View Gallery</Link>
                </div>
              </>
            )}
          </div>
                      <Link href="/weather/roorkee-in" className={styles.weatherContainer}>
                      {weatherLoading ? (
                        <LoadingSpinner size="small" text="Loading weather..." />
                      ) : (
                        <div className={styles.weatherForecasts}>
                          <div className={styles.weatherWidget}>
                            <h4>Today</h4>
                            <div className={styles.condition}>
                              {todayWeather.icon && <Image src={todayWeather.icon} alt="Weather icon" width={50} height={50} />}
                            </div>
                            <div className={styles.temp}>{todayWeather.temp}</div>
                            <div className={styles.conditionText}>{todayWeather.condition}</div>
                          </div>
                          <div className={styles.weatherWidget}>
                            <h4>Tomorrow</h4>
                            <div className={styles.condition}>
                              {tomorrowWeather.icon && <Image src={tomorrowWeather.icon} alt="Weather icon" width={50} height={50} />}
                            </div>
                            <div className={styles.temp}>{tomorrowWeather.temp}</div>
                            <div className={styles.conditionText}>{tomorrowWeather.condition}</div>
                          </div>
                        </div>
                      )}
                    </Link>        </section>

        {/* Posts Section */}
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Posts</h2>
                <Link href="/posts" className={styles.viewAllLink}>View All →</Link>
            </div>
            {posts.length > 0 ? (
              <div className={styles.cardGrid4}>
                {posts.map((post) => (
                  <Link href={`/post/${post.category}/${post.slug}`} className={styles.card} key={post.id}>
                    <div className={styles.cardImage} style={{backgroundImage: `url(${post.images && post.images.length > 0 ? post.images[0] : '/no-image.png'})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                    <div className={styles.cardContent}>
                      <span className={styles.categoryBadge}>{post.category}</span>
                      <h3>{post.title}</h3>
                      <p className={styles.cardMeta}>By {post.author.name} &middot; {post.formattedUpdateDate}</p>
                      <p>{post.intro && post.intro.length > 120 ? `${post.intro.substring(0, 120)}...` : post.intro}</p>
                      <span className={styles.cardCta}>Read More</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
                <EmptyState
                    title="No Posts Yet"
                    message="Be the first to share your story with the community!"
                    icon="📝"
                />
            )}
        </section>

        {/* Upcoming Events Section */}
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Upcoming Events</h2>
                <Link href="/events" className={styles.viewAllLink}>View All →</Link>
            </div>
            {events.length > 0 ? (
                <div className={styles.eventGrid}>
                    {events.map((event) => (
                        <div className={styles.eventCard} key={event.id}>
                            <div className={styles.eventDate}>
                                <div className={styles.month}>{event.formattedMonth}</div>
                                <div className={styles.day}>{event.formattedDay}</div>
                            </div>
                            <div className={styles.eventDetails}>
                                <h3>{event.name}</h3>
                                <p>{event.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No Upcoming Events"
                    message="Stay tuned for exciting community events coming soon!"
                    icon="📅"
                />
            )}
        </section>

        {/* News Section */}
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Latest News</h2>
                <Link href="/news" className={styles.viewAllLink}>View All →</Link>
            </div>
            {news.length > 0 ? (
                <div className={styles.cardGrid4}>
                    {news.map((item) => (
                        <div className={styles.card} key={item.id}>
                            <div className={styles.cardImage} style={{backgroundImage: `url(${item.image_url ? item.image_url : '/no-image.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <div className={styles.cardContent}>
                                <h3>{item.title}</h3>
                                <p>{item.formattedPubDate}</p>
                                <p>{item.description && item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}</p>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.cardCta}>Read More ↗</a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No News Available"
                    message="Check back soon for the latest news about Roorkee!"
                    icon="📰"
                />
            )}
        </section>

        {/* Photo Gallery Section */}
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>From the Gallery</h2>
                <Link href="/albums" className={styles.viewAllLink}>View All →</Link>
            </div>
            {albums.length > 0 ? (
                <div className={styles.cardGrid6}>
                    {albums.map((album, i) => (
                        <Link href={`/album/${album.id}`} className={styles.galleryCard} key={album.id}>
                            <Image src={album.images[0]} alt={`Gallery image ${i+1}`} width={300} height={300} />
                        </Link>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="No Photos Yet"
                    message="Share your memories with the community by uploading photos!"
                    icon="📸"
                />
            )}
        </section>

      </main>

      {/* <section className={styles.ctaSection}>
        <div className={styles.container}>
            <h2>Get Involved!</h2>
            <p>Want to contribute to our community? Find out how you can get involved.</p>
            <Link href="#" className={styles.ctaButton}>Learn More</Link>
        </div>
      </section> */}

      
    </>
  );
};



export default IndexDev;

export async function getStaticProps() {
  const resp = await adminGetDocument<HomepageConfig>('appconfig', 'homepage');
  const postDisplay = await getPostsWithDetailsAdmin();
  const news = await getNewsAdmin({ limit: 8, preferredApiSource: 'newsdata.io' });
  const events = await getEventsAdmin({ limit: 4 });
  const allAlbums = await getAlbumsAdmin({ limit: 12 });
  const albums = allAlbums.filter(a => a.images && a.images.length > 0).slice(0, 6);

  return {
    props: {
      data: { ...defaultHomeData, ...(resp || {}) },
      posts: postDisplay,
      news,
      events,
      albums,
    },
    revalidate: 86400, // regenerate page every day
  }
}