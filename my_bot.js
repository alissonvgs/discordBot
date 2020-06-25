const { Client, MessageAttachment, Message } = require('discord.js');
const client = new Client();
const { prefix, token, generalTextId } = require('./config.json');
const ytdl = require("ytdl-core");


const queue = new Map();

//Lembrar de tirar o token antes do PUSH
//Pegar o token no https://discord.com/developers/applications

let commands = ["help, time, valeu, ping, repete"];

//Basic config

client.on('ready', () => {
    console.log("Conectado como " + client.user.tag)

    client.user.setActivity("JavaScript", { type: "JOGANDO" })

    client.guilds.cache.forEach((guild) => {
        console.log(guild.name);
        guild.channels.cache.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
        });
    });

    let generalChannel = client.channels.cache.get(generalTextId);
    generalChannel.send("Coe, entrei no servidor!");


});

// Text commands
client.on('message', receivedMessage => {

    if (receivedMessage.content.startsWith(prefix)) {
        processCommand(receivedMessage);
    };
});


// Music

client.on('message', async message => {

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    }
});



//Functions - Music 
async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Você precisa estar em um canal de voz!");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send("Preciso de permissão para entrar no canal de voz.");
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} foi adicionado na fila.`);
    }

}

function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send("Você precisa estar em um canal de voz para poder pular.");
    if (!serverQueue) return message.channel.send("Não tem som para pular.");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send("Você precisa estar em um canal de voz para poder parar.");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log("Musica finalizada!");
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}


//Functions - Text

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    switch (primaryCommand) {

        case "":
            receivedMessage.channel.send("Digita `!help` se você precisar ver os comandos");
        case "help":
            helpCommand(arguments, receivedMessage);
            break;
        case "time":
            receivedMessage.channel.send("O horário atual é: " + dataHoraAtual());
            break;
        case "repete":
            receivedMessage.channel.send("Ei boy, " + receivedMessage.author.toString() + "!   Tu falou: " + receivedMessage.content);
            break;
        case "valeu":
            receivedMessage.react("👍");
            break;
        case "ping":
            receivedMessage.reply("pong");
            break;
    };
};

function helpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
        receivedMessage.channel.send("Esses são os nosso comandos:\n`[" + commands + "]`");
    } else {
        receivedMessage.channel.send("Parece que tu precisa de ajuda com " + arguments);
    };
};

function dataHoraAtual() {
    var dNow = new Date();
    var localdate = dNow.getDate() + "/" + (dNow.getMonth() + 1) + "/" + dNow.getFullYear() + " " + dNow.getHours() + ": " + dNow.getMinutes();
    return localdate;
};


client.login(token);