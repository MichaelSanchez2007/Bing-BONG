import 'dotenv/config';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import { AudioManager } from 'discord-media-player';
import { Client, Intents } from 'discord.js';
import { willow } from './willow.js';
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});
const audioManager = new AudioManager({});
client.on('ready', async () => {
    willow();
    console.log('Discord.js client is ready!');
});
async function playSound(message, voiceChannel) {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    });
    const player = audioManager.getPlayer(connection);
    if (player.playing)
        player.stop();
    await player.play('https://www.youtube.com/watch?v=UaUa_0qPPgc', 0);
    return player;
}
;
const hour = () => new Date().getHours() % 12;
const popOff = async (message, voiceChannel) => {
    let remaining = hour();
    const player = await playSound(message, voiceChannel);
    player.loop();
    function stop() {
        player.stop();
        getVoiceConnection(message.guildId).disconnect();
    }
    setTimeout(stop, 4500 * remaining);
};
let interval;
client.on('messageCreate', async (message) => {
    if (!message.guild)
        return;
    if (message.author.bot)
        return;
    const channel = message.member?.voice.channel;
    if (!channel)
        return void message.reply('bruh... u not even in a voice channel smh');
    if (message.content === '-setup') {
        if (interval)
            return void message.reply('chill we already poppin off');
        interval = setInterval(popOff.bind(null, message, channel), 60000);
        message.reply('poppin off in `n` amount of minutes where `n` is `60`\nIf the poppin off is urgent please use `-popoff`');
    }
    if (['-join', '-popoff', '-pop off'].includes(message.content)) {
        try {
            popOff(message, channel);
            message.reply('Finna pop offff');
        }
        catch (error) {
            console.error(error);
        }
    }
});
client.login(process.env.TOKEN);
