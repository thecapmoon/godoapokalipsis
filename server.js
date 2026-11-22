const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, 'scores.json');
app.use(express.json({limit:'20kb'}));
app.use(express.static(path.join(__dirname,'public')));
function readScores(){try{return JSON.parse(fs.readFileSync(DB,'utf8'));}catch{return [];}}
function writeScores(rows){fs.writeFileSync(DB,JSON.stringify(rows,null,2));}
app.get('/api/scores',(req,res)=>res.json(readScores().sort((a,b)=>b.score-a.score).slice(0,10)));
app.post('/api/scores',(req,res)=>{
 const score=Math.max(0,Math.min(86400,Math.floor(Number(req.body.score)||0)));
 const name=String(req.body.name||'Игрок').replace(/[<>]/g,'').slice(0,32)||'Игрок';
 const userId=req.body.userId?String(req.body.userId):null;
 const rows=readScores();
 const old=userId?rows.find(x=>x.userId===userId):null;
 if(old){if(score>old.score){old.score=score;old.name=name;}} else rows.push({name,userId,score});
 writeScores(rows.sort((a,b)=>b.score-a.score).slice(0,100));
 res.json({ok:true});
});
app.listen(PORT,()=>{
 console.log('Game server on '+PORT);
 if(process.env.BOT_TOKEN && process.env.WEB_APP_URL) require('./bot');
});
