import { Event } from "../../service/PostService";
import styles from '../../styles/IndexDev.module.css';

export type DisplayEventParams = {
    event: Event
}

const EventListItem = (params: DisplayEventParams) => {
    const { event } = params;

    return (
        <div className={styles.eventCard}>
            <div className={styles.eventDate}>
                <div className={styles.month}>{event.formattedMonth}</div>
                <div className={styles.day}>{event.formattedDay}</div>
                <div className={styles.year}>{event.formattedYear}</div>
            </div>
            <div className={styles.eventDetails}>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
            </div>
        </div>
    )
}

export default EventListItem;
