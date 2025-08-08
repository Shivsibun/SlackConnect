import styles from './styles/schedule.module.css';

interface ScheduledMessage {
  id: string;
  channel: string;
  text: string;
  sendAt: string;
  sent: boolean;
}

interface Props {
  messages: ScheduledMessage[];
  refreshMessages: () => void;
}

function Schedulemessages({  messages, refreshMessages }: Props) {
  const cancelMessage = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/scheduled/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to cancel');
      alert('Message canceled!');
      refreshMessages();
    } catch (err) {
      alert('Error canceling message: ' + err);
    }
  };

  return (
    <div className={styles['schedule-container']}>
      <h3 className={styles['schedule-title']}>Scheduled Messages</h3>
      {messages.length === 0 ? (
        <p className={styles['no-messages']}>No scheduled messages.</p>
      ) : (
        <ul className={styles['schedule-list']}>
          {messages.map(({ id, channel, text, sendAt }) => (
            <li key={id} className={styles['schedule-item']}>
              <div className={styles['schedule-row']}>
                <strong>Channel:</strong> <span className={styles['schedule-channel']}>{channel}</span>
              </div>
              <div className={styles['schedule-row']}>
                <strong>Send At:</strong>{' '}
                <span className={styles['schedule-sendAt']}>{new Date(sendAt).toLocaleString()}</span>
              </div>
              <div className={styles['schedule-row']}>
                <strong>Message:</strong> <span className={styles['schedule-text']}>{text}</span>
              </div>
              <button
                className={styles['cancel-button']}
                onClick={() => cancelMessage(id)}
                aria-label={`Cancel scheduled message to channel ${channel} at ${new Date(sendAt).toLocaleString()}`}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Schedulemessages;
