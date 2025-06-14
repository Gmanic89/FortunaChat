// services/streamChat.js
import { StreamChat } from 'stream-chat';
import { STREAM_CONFIG, UI_CONFIG } from '../utils/constants';

class StreamChatService {
  constructor() {
    this.client = StreamChat.getInstance(STREAM_CONFIG.API_KEY);
  }

  getClient() {
    return this.client;
  }

  async connectUser(user) {
    const token = this.client.devToken(user.username);
    const isAdmin = this.checkIfAdmin(user.username);
    
    await this.client.connectUser(
      {
        id: user.username,
        name: user.username,
        image: this.generateAvatarUrl(user.username),
        role: isAdmin ? 'admin' : 'user',
      },
      token
    );

    return { isAdmin };
  }

  async disconnectUser() {
    await this.client.disconnectUser();
  }

  async createPrivateChannelWithAdmin(username) {
    try {
      const channelId = `private-${STREAM_CONFIG.ADMIN_USERNAME}-${username}`;
      const privateChannel = this.client.channel('messaging', channelId, {
        name: `Chat con ${username}`,
        members: [STREAM_CONFIG.ADMIN_USERNAME, username],
        created_by_id: username,
      });
      
      await privateChannel.create();
      console.log(`✅ Canal privado creado: ${channelId}`);
      return privateChannel;
    } catch (error) {
      console.error('Error creando canal privado:', error);
      return this.createFallbackChannel(username);
    }
  }

  async createFallbackChannel(username) {
    try {
      const channelId = `private-${STREAM_CONFIG.ADMIN_USERNAME}-${username}`;
      const fallbackChannel = this.client.channel('messaging', channelId, {
        name: `Chat con ${username}`,
        members: [username],
        created_by_id: username,
      });
      await fallbackChannel.create();
      console.log(`✅ Canal creado, admin se agregará después`);
      return fallbackChannel;
    } catch (fallbackError) {
      console.error('Error en canal fallback:', fallbackError);
      return null;
    }
  }

  async getDefaultChannel(user, isAdmin) {
    if (isAdmin) {
      const defaultChannel = this.client.channel('livestream', 'general');
      await defaultChannel.watch();
      return defaultChannel;
    } else {
      const defaultChannel = await this.createPrivateChannelWithAdmin(user.username);
      
      if (!defaultChannel) {
        const waitingChannel = this.client.channel('messaging', `waiting-${user.username}`, {
          name: 'Esperando al administrador...',
          members: [user.username],
        });
        await waitingChannel.create();
        return waitingChannel;
      }
      
      return defaultChannel;
    }
  }

  async queryChannels(username) {
    return await Promise.race([
      this.client.queryChannels(
        { type: 'messaging', members: { $in: [username] } },
        { last_message_at: -1 },
        { limit: 20 }
      ),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), UI_CONFIG.REQUEST_TIMEOUT)
      )
    ]);
  }

  checkIfAdmin(username) {
    return username === STREAM_CONFIG.ADMIN_USERNAME;
  }

  generateAvatarUrl(username) {
    return `${UI_CONFIG.AVATAR_BASE_URL}?name=${username}&${UI_CONFIG.AVATAR_PARAMS}`;
  }
}

export const streamChatService = new StreamChatService();