const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')

const token = '5376694406:AAH__NtCHjUVWhRPSUUANv9OowK6h4hrf8M'


const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру, от 0 до 9, а ты должен ее отгодать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадвый`, gameOptions)
}

const start = () => {
    bot.setMyCommands ( [
        {command: '/start', description: `Начальное приветствие`},
        {command: '/info', description: `Полчить информацию`},
        {command: '/game', description: `Угадай цифру`},
    ])
    
    bot.on('message', async msq =>{
        const text = msq.text;
        const chatId = msq.chat.id;
        if ( text === '/start') {
           await bot.sendMessage(chatId, `https://tlgrm.ru/_/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/7.webp`)
           return bot.sendMessage(chatId, `Доброго времечка` );
    
        }
        if ( text === '/info') {
           return bot.sendMessage(chatId, `Тебя зовут ${msq.from.first_name} ${msq.from.last_name}` );
    
        }
        if ( text === '/game') {
            return startGame(chatId);
        }
            return bot.sendMessage(chatId, `Я тебя не понимаю, поробуй еще раз`)
    })
    bot.on( 'callback_query',  async msq => {
        const data = msq.data;
        const chatId = msq.message.chat.id;
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
        if (data === '/again') {
            return startGame(chatId);
        }
        if ( data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `Ты не отгадал цифру ${chats[chatId]}`, againOptions)
        }
        


    })

}
start()
