import { Event } from '../../service/PostService';
import EventListItem from './eventListItem';

type EventListProps = {
    events: Event[];
};

export default function EventList({ events }: EventListProps) {
    return (
        <div>
            {events.map((event) => (
                <EventListItem key={event.id} event={event} />
            ))}
        </div>
    );
}
