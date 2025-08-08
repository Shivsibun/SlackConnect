
function Connectslack() {
  const SLACK_CLIENT_ID = import.meta.env.VITE_SLACK_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SLACK_REDIRECT_URI;

  const scopes = ['channels:read', 'chat:write'].join(',');

  const authUrl = "https://slack.com/oauth/v2/authorize?client_id=9309003919574.9318713485346&scope=channels:read,chat:write&redirect_uri=https%3A%2F%2Fpig-cool-jay.ngrok-free.app%2Fapi%2Fauth%2Fslack%2Fcallback";
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <a href={authUrl} style={{display: 'inline-block',marginTop: '30vh',padding: '40px 40px',backgroundColor: '#4A154B',color: 'white',borderRadius: '10px',textDecoration: 'none',fontWeight: 'bolder',fontSize: '30px',}} >
        Connect to Slack
      </a>
    </div>
  );
}

export default Connectslack;
