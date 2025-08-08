import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/IndexDev.module.css';
import { getDocument } from '../firebase/firestore';
import { getAlbums, getEvents, getNews, getPostsWithDetails } from '../service/PostService';
import { useEffect, useState } from 'react';
import { Weather } from './weather/[id]';
import { uiRound } from '../components/ui/uiUtils';

import { PostDisplayType } from './posts/[id]';
import { Event, NewsArticle } from '../service/PostService';
import { AlbumType } from '../pages/account/editAlbum';

type IndexDevProps = {
  posts: PostDisplayType[];
  news: NewsArticle[];
  events: Event[];
  albums: AlbumType[];
  data: {
    heroTextDesc: string;
  };
};

function IndexDev({ posts = [], news = [], events = [], albums = [], data = { heroTextDesc: "Welcome to our town. Find all the information you need about our vibrant community."} }: IndexDevProps) {
  const [weather, setWeather] = useState({} as Weather);
  const [todayWeather, setTodayWeather] = useState({ temp: '', condition: '', icon: '' });
  const [tomorrowWeather, setTomorrowWeather] = useState({ temp: '', condition: '', icon: '' });

  useEffect(() => {
    fetch('/api/weather')
      .then(res => res.json())
      .then(w => setWeather(w));
  }, []);

  useEffect(() => {
    if (weather.current) {
      setTodayWeather({
        temp: `${uiRound(weather.current.temp, 0)}°C`,
        condition: weather.current.weather[0].main,
        icon: `https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`
      });
    }
    if (weather.daily && weather.daily.length > 1) {
      setTomorrowWeather({
        temp: `${uiRound(weather.daily[1].temp.day, 0)}°C`,
        condition: weather.daily[1].weather[0].main,
        icon: `https://openweathermap.org/img/wn/${weather.daily[1].weather[0].icon}@2x.png`
      });
    }
  }, [weather]);

  return (
    <>
      <Head>
        <title>Roorkee.org: Town Information</title>
        <meta name="description" content="Roorkee.org: Town Information." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>Roorkee.org</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
          <Link href="/news/1">News</Link>
          <Link href="/events">Events</Link>
          <Link href="/albums">Albums</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1>Welcome to Roorkee</h1>
            <p>{data.heroTextDesc}</p>
            {/* <Link href="/directory" className={styles.ctaButton}>Explore Directory</Link> */}
          </div>
          <div className={styles.weatherContainer}>
            <h3>Roorkee Weather</h3>
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
          </div>
        </section>

        {/* Posts Section */}
        <section className={styles.section}>
            <div className={styles.centerTitle}>
                <h2 className={styles.sectionTitle}>Recent Posts</h2>
            </div>
            <div className={styles.cardGrid4}>
                {posts.map((post) => (
                    <div className={styles.card} key={post.id}>
                        <div className={styles.cardImage} style={{backgroundImage: `url(${post.images && post.images.length > 0 ? post.images[0] : '/no-image.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className={styles.cardContent}>
                            <h3>{post.title}</h3>
                            <p>By {post.author.name}</p>
                            <p>{post.intro && post.intro.length > 120 ? `${post.intro.substring(0, 120)}...` : post.intro}</p>
                            <Link href={`/post/${post.category}/${post.slug}`}>Read More</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* News Section */}
        <section className={styles.section}>
            <div className={styles.centerTitle}>
                <h2 className={styles.sectionTitle}>Latest News</h2>
            </div>
            <div className={styles.cardGrid4}>
                {news.map((item) => (
                    <div className={styles.card} key={item.id}>
                        <div className={styles.cardImage} style={{backgroundImage: `url(${item.urlToImage ? item.urlToImage : '/no-image.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className={styles.cardContent}>
                            <h3>{item.title}</h3>
                            <p>{item.formattedPubDate}</p>
                            <p>{item.description && item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}</p>
                            <Link href={item.url}>Read More</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Upcoming Events Section */}
        <section className={styles.section}>
            <div className={styles.centerTitle}>
                <h2 className={styles.sectionTitle}>Upcoming Events</h2>
            </div>
            <div>
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
        </section>

        {/* Photo Gallery Section */}
        <section className={styles.section}>
            <div className={styles.centerTitle}>
                <h2 className={styles.sectionTitle}>From the Gallery</h2>
            </div>
            <div className={styles.cardGrid6}>
                {albums.filter(a => a.images && a.images.length > 0).slice(0, 6).map((album, i) => (
                    <Link href={`/album/${album.id}`} className={styles.galleryCard} key={i}>
                        <Image src={album.images[0]} alt={`Gallery image ${i+1}`} width={300} height={300} />
                    </Link>
                ))}
            </div>
        </section>

      </main>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
            <h2>Get Involved!</h2>
            <p>Want to contribute to our community? Find out how you can get involved.</p>
            <Link href="#" className={styles.ctaButton}>Learn More</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
            <Link href="#">About Us</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Contact Us</Link>
        </div>
        <div className={styles.socialLinks}>
            <Link href="#"><Image src="https://simpleicons.org/icons/facebook.svg" alt="Facebook" width={24} height={24} /></Link>
            <Link href="#"><Image src="https://simpleicons.org/icons/twitter.svg" alt="Twitter" width={24} height={24} /></Link>
            <Link href="#"><Image src="https://simpleicons.org/icons/instagram.svg" alt="Instagram" width={24} height={24} /></Link>
        </div>
        <p>&copy; 2025 TownName. All Rights Reserved.</p>
      </footer>
    </>
  );
};

IndexDev.noLayout = true;

export default IndexDev;

export async function getStaticProps() {
  const resp = await getDocument({ path: 'appconfig', pathSegments: ['homepage'] });
  const postDisplay = await getPostsWithDetails();
  const news = await getNews({ limit: 8 });
  const events = await getEvents({ limit: 4 });
  const albums = await getAlbums({ limit: 6 });
  
  return {
    props: {
      data: resp,
      posts: postDisplay,
      news,
      events,
      albums,
    },
    revalidate: 86400, // regenerate page every day
  }
}