import { Event } from '../../service/PostService';
import EventListItem from './eventListItem';
import styles from '../../styles/IndexDev.module.css';

type EventListProps = {
    events: Event[];
};

export default function EventList({ events }: EventListProps) {
    return (
        <div className={styles.eventGrid}>
            {events.map((event) => (
                <EventListItem key={event.id} event={event} />
            ))}
        </div>
    );
}
