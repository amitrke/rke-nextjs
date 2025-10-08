import styles from '../../styles/EmptyState.module.css';

type EmptyStateProps = {
    title: string;
    message: string;
    icon?: string;
};

export default function EmptyState({ title, message, icon = '📭' }: EmptyStateProps) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.icon}>{icon}</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.message}>{message}</p>
        </div>
    );
}
