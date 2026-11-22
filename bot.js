const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const webAppUrl = process.env.WEB_APP_URL;
if(!token || !webAppUrl){console.error('Set BOT_TOKEN and WEB_APP_URL environment variables');process.exit(1);}
const bot = new TelegramBot(token,{polling:true});
bot.onText(/\/start/,msg=>bot.sendMessage(msg.chat.id,'🧟 Добро пожаловать в ГОДОАПОКАЛИПСИС!\nВыживи как можно дольше и попади в таблицу рекордов.',{reply_markup:{inline_keyboard:[[{text:'🎮 ИГРАТЬ',web_app:{url:webAppUrl}}]]}}));
bot.onText(/\/top/,async msg=>{try{const r=await fetch(webAppUrl.replace(/\/$/,'')+'/api/scores');const rows=await r.json();const text=rows.length?rows.slice(0,10).map((x,i)=>`${i+1}. ${x.name} — ${x.score} сек.`).join('\n'):'Рекордов пока нет. Будь первым!';bot.sendMessage(msg.chat.id,'🏆 ТОП ИГРОКОВ\n'+text);}catch{bot.sendMessage(msg.chat.id,'Не удалось загрузить рекорды.');}});
