
const { Client, MessageAttachment } = require('discord.js');
const client = new Client();

//Lembrar de tirar o token antes do PUSH
//Pegar o token no https://discord.com/developers/applications
const token = ""
const generalId = "724764172100960270"

client.on('ready', () => {
    console.log("Conectado como " + client.user.tag)

    client.user.setActivity("JavaScript", { type: "JOGANDO" })

    client.guilds.cache.forEach((guild) => {
        console.log(guild.name);
        guild.channels.cache.forEach((channel) => {
            console.log(` - ${channel.name} ${channel.type} ${channel.id}`)
        });
    });

    const attachmentFile = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fgifs.alphacoders.com%2Fgifs%2Fview%2F11660&psig=AOvVaw0pDKSOAebx3edjt4oefjyB&ust=1592956953751000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMCsmJ3RluoCFQAAAAAdAAAAABAJ";

    let generalChannel = client.channels.cache.get(generalId);
    //const attachment = new MessageAttachment(attachmentFile);
    generalChannel.send("Coe, entrei no servidor!");


});

client.on('message', receivedMessage => {

    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage);
    };

    if (receivedMessage.content == "!repete") {
        receivedMessage.channel.send("Ei boy, " + receivedMessage.author.toString() + "!   Tu falou: " + receivedMessage.content);
    }

    if (receivedMessage.content == "valeu") {
        receivedMessage.react("👍");
    }

    if (receivedMessage.content == "!ping") {
        receivedMessage.reply('pong (Reply)');
    }

});

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage);
    } else if (primaryCommand == "time") {
        receivedMessage.channel.send("O horário atual é: "+ dataHoraAtual());
    }
}


function helpCommand(arguments, receivedMessage) {
    if (arguments.length == 0) {
        receivedMessage.channel.send("Eu não entendi não, digita `!help [Algo]` se tu precisar de ajuda");
    } else {
        receivedMessage.channel.send("Parece que tu precisa de ajuda com " + arguments);
    }
}

function dataHoraAtual() {
    var dNow = new Date();
    var localdate = dNow.getDate() + "/" + (dNow.getMonth() + 1) + "/" + dNow.getFullYear() + " " + dNow.getHours() + ": " + dNow.getMinutes();
    return localdate;
}

client.login(token);

