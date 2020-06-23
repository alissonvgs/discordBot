export function processCommand(receivedMessage){
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    if(primaryCommand == "help"){
        helpCommand(arguments, receivedMessage);
    }
}


export function helpCommand(arguments, receivedMessage){
    if(arguments.length == 0){
        receivedMessage.channel.send("Eu não entendi não, digita `!help [Algo]` se tu precisar de ajuda");
    }else{
        receivedMessage.channel.send("Parece que tu precisa de ajuda com "+ arguments);
    }
}