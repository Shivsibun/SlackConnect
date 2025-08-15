import { useEffect, useState } from 'react';

import Connectslack from './components/Connectslack';
import Messagescheduler from './components/Messagescheduler';
import Schedulemessages from './components/Schedulemessages';

interface ScheduledMessage {
  id: string;
  channel: string;
  text: string;
  sendAt: string;
  sent: boolean;
}

function App() {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchScheduledMessages = async (tid: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/messages/scheduled/${encodeURIComponent(tid)}`);
      if (!res.ok) throw new Error('Failed to fetch scheduled messages');
      const data = await res.json();
      setScheduledMessages(data);
    } catch (err) {
      alert('Error loading scheduled messages: ' + err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tid = params.get('teamId');
    if (tid) {
      setTeamId(tid);
      fetchScheduledMessages(tid);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <div>
      {!teamId ? (
        <Connectslack />
      ) : (
        <>
          <h2 style={{ color: '#4a154b', textAlign: 'center' }}>Slack Connected! Team ID: {teamId}</h2>
          <Messagescheduler
            teamId={teamId}
            onMessageScheduled={(newMsg: ScheduledMessage) =>
              setScheduledMessages((prev) => [newMsg, ...prev])
            }
          />
          <Schedulemessages
            teamId={teamId}
            messages={scheduledMessages}
            refreshMessages={() => teamId && fetchScheduledMessages(teamId)}
          />
        </>
      )}
    </div>
  );
}
export default App;