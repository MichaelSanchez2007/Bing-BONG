// require the needed discord.js classes
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { createDiscordJSAdapter } from './adapter.js';
import { Client, VoiceChannel, Intents } from 'discord.js';
// import { token } from './config.json'
// console.log(token);

const token = 'ODc2NTI4NTA1MTUwNjQ0MzA0.YRlYyA.jQAo2lJG89SGBOlc-uJn1MrbtY4'

const player = createAudioPlayer();

function playSong() {
	const resource = createAudioResource('./sounds/Tacobell.mp3', {
		inputType: StreamType.Arbitrary,
	});
	
	player.play(resource);
	
	return entersState(player, AudioPlayerStatus.Playing, 5e3);
};

async function connectToChannel(channel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: createDiscordJSAdapter(channel),
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

// create a new Discord client
const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES
	]
});

// login to Discord with your app's token
bot.login(token);

// when the client is ready, run this code
bot.on('ready',async () => {
	console.log('Bing Bong IS ALIVE!');

	try {
		await playSong();
		console.log('Song is ready to play!');
	} catch (error) {
		console.error(error);
	}
});

// Play sound
bot.on('message', async message => {
	if (!message.guild) return;

	if (message.content === 'bing') {
		message.channel.send('Bong.');
 	}

	// Join command
	if (message.content === "Pull up to da crib" || "-join") {
		const channel = message.member?.voice.channel;
		
		if (channel) {
			try {
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
				message.reply('Playing now!');
			} catch (error) {
				console.error(error);
			}
		} else {
			message.reply('Join a voice channel then try again!');
		}
    }

});
