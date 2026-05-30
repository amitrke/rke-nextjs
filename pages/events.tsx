import { getEvents } from '../service/PostService';
import { Event } from '../service/PostService';
import HeadTag from '../components/ui/headTag';
import EventList from '../components/ui/eventList';

type EventsPageProps = {
    events: Event[];
};

export default function EventsPage({ events }: EventsPageProps) {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.roorkee.org').replace(/\/+$/, '');
    const eventsJsonLd = events.map(event => ({
        '@context': 'https://schema.org',
        '@type': 'Event',
        'name': event.name,
        'description': event.description,
        'startDate': event.date,
        'url': `${siteUrl}/events`,
        'location': {
            '@type': 'Place',
            'name': 'Roorkee',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'Roorkee',
                'addressRegion': 'Uttarakhand',
                'addressCountry': 'IN',
            },
        },
        'organizer': {
            '@type': 'Organization',
            'name': 'Roorkee.org',
            'url': siteUrl,
        },
    }));
    return (
        <div className="mx-auto w-full max-w-7xl px-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
            />
            <HeadTag
                title="Upcoming Events | Roorkee.org"
                description="Upcoming community events in and around Roorkee."
                url="/events"
            />
            <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>
                <h1 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 'bold', color: '#333' }}>Upcoming Events</h1>
                <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#666', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>Community events, holidays, and celebrations in and around Roorkee</p>
            </div>
            <EventList events={events} />
        </div>
    );
}

export async function getStaticProps() {
    const events = await getEvents({ limit: 50 }); // Fetch up to 50 upcoming events
    return {
        props: {
            events,
        },
        revalidate: 2592000, // Regenerate page every month
    };
}
