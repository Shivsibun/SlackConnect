function Connectslack() {
  const SLACK_CLIENT_ID = import.meta.env.VITE_SLACK_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SLACK_REDIRECT_URI;

  const scopes = ['channels:read', 'chat:write'].join(',');

  const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${encodeURIComponent(
    SLACK_CLIENT_ID
  )}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <a
        href={authUrl}
        style={{
          display: 'inline-block',
          marginTop: '30vh',
          padding: '40px 40px',
          backgroundColor: '#4A154B',
          color: 'white',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: 'bolder',
          fontSize: '30px',
        }}
      >
        Connect to Slack
      </a>
    </div>
  );
}

export default Connectslack;
