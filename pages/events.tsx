import { getEvents } from '../service/PostService';
import { Event } from '../service/PostService';
import HeadTag from '../components/ui/headTag';
import EventList from '../components/ui/eventList';

type EventsPageProps = {
    events: Event[];
};

export default function EventsPage({ events }: EventsPageProps) {
    return (
        <div className="container">
            <HeadTag title="Upcoming Events" />
            <h1>Upcoming Events</h1>
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
