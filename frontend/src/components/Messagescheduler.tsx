import { useState} from 'react';
import styles from './styles/message.module.css';

interface ScheduledMessage {
  id: string;
  channel: string;
  text: string;
  sendAt: string;
  sent: boolean;
}

interface Props {
  teamId: string;
  onMessageScheduled?: (msg: ScheduledMessage) => void;
}

function Messagescheduler({ teamId, onMessageScheduled }: Props) {
  const [channel, setChannel] = useState('');
  const [sendText, setSendText] = useState('');
  const [channelsch, setChannelsch] = useState('');
  const [scheduleText, setScheduleText] = useState('');
  const [sendAt, setSendAt] = useState('');
  const [sending, setSending] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const sendMessage = async () => {
    if (!channel || !sendText) return alert('Channel and Text are required');
    try {
      setSending(true);
      const res = await fetch(`${backendUrl}/api/messages/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, channel, text: sendText }),
      });
      if (!res.ok) throw new Error('Failed to send');
      alert('Message sent!');
      setSendText('');
    } catch (err) {
      alert('Error sending message: ' + err);
    } finally {
      setSending(false);
    }
  };
const scheduleMessage = async () => {
  if (!channelsch || !scheduleText || !sendAt) return alert('All fields required');
  try {
    setScheduling(true);
    const localDate = new Date(sendAt);
    const utcSendAt = localDate.toISOString();

    const res = await fetch(`${backendUrl}/api/messages/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId, channel: channelsch, text: scheduleText, sendAt: utcSendAt }), // <-- corrected
    });
    if (!res.ok) throw new Error('Failed to schedule');
    const newScheduledMessage: ScheduledMessage = await res.json();
    alert('Message scheduled!');
    setScheduleText('');
    setSendAt('');
    if (onMessageScheduled) onMessageScheduled(newScheduledMessage);
  } catch (err) {
    alert('Error scheduling message: ' + err);
  } finally {
    setScheduling(false);
  }
};


  return (
    <>
      <h1 className={styles.title}>Slack Message Scheduler</h1>
      <div className={styles.container}>

        <div style={{ border: '2px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Send Message Now</h2>
            <label htmlFor="sendChannel" className={styles.label}>Channel ID</label>
            <input id="sendChannel" type="text" placeholder="Enter channel ID" value={channel}  onChange={(e) => setChannel(e.target.value)} className={styles.input} disabled={sending}/>
            <label htmlFor="sendText" className={styles.label}>Message</label>
            <textarea id="sendText" placeholder="Type message here..." value={sendText} onChange={(e) => setSendText(e.target.value)} className={styles.textarea} disabled={sending}/>
            <button onClick={sendMessage} disabled={sending} className={sending ? styles.buttonDisabled : styles.button}>
              {sending ? 'Sending...' : 'Send Now'}
            </button>
          </section>
        </div>

        <div style={{ border: '2px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Schedule Message</h2>
            <label htmlFor="scheduleChannel" className={styles.label}>Channel ID</label>
            <input id="scheduleChannel" type="text" placeholder="Enter channel ID" value={channelsch} onChange={(e) => setChannelsch(e.target.value)} className={styles.input} disabled={scheduling} />
            <label htmlFor="scheduleText" className={styles.label}>Message</label>
            <textarea
              id="scheduleText" placeholder="Type message here..." value={scheduleText} onChange={(e) => setScheduleText(e.target.value)} className={styles.textarea}disabled={scheduling} />
            <label htmlFor="sendAt" className={styles.label}>Set the Date and Time to send</label>
            <input
              id="sendAt" type="datetime-local" value={sendAt} onChange={(e) => setSendAt(e.target.value)} className={styles.input}disabled={scheduling}/>
            <button onClick={scheduleMessage} disabled={scheduling} className={scheduling ? styles.buttonDisabled : styles.button} >
              {scheduling ? 'Scheduling...' : 'Schedule Message'}
            </button>
          </section>
        </div>
      </div>
    </>
  );
}

export default Messagescheduler;
