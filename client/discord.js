import { DiscordSDK } from '@discord/embedded-app-sdk';

let auth;

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSdk().then(() => {
  console.log('Discord SDK is authenticated');

  updateUserDetails();
});
async function setupDiscordSdk() {
  await discordSdk.ready();
  console.log('Discord SDK is ready');

  // Authorize with Discord Client
  const { code } = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: 'code',
    state: '',
    prompt: 'none',
    scope: ['identify', 'guilds'],
  });

  // Retrieve an access_token from your activity's server
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
  const { access_token } = await response.json();

  // Authenticate with Discord client (using the access_token)
  auth = await discordSdk.commands.authenticate({
    access_token,
  });

  if (auth == null) {
    throw new Error('Authenticate command failed');
  }
}

async function updateUserDetails() {
  const userName = document.querySelector('.user-name');
  const profilePic = document.querySelector('.user-avatar');

  const user = await fetch(`https://discord.com/api/v10/users/@me`, {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());

  if (user != null) {
    userName.innerText = user.global_name;
    profilePic.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  }
}
