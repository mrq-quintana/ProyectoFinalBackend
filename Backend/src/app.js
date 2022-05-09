import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import initializePassport from './config/passport.js';
import sessionRouter from './routes/session.routes.js';
import productsRouter from './routes/products.routes.js';
import usersRouter from './routes/users.routes.js'
import cartsRouter from './routes/carts.routes.js';
import logger from "./logger/logger.js";
import core from 'os';
import {Server} from 'socket.io';
import { messageService } from './services/services.js';
import {argProcesados} from './config/config.js';
import {mailing} from './comunication/gmail.js';
import {smsing} from './comunication/sms.js';
import {wsping} from './comunication/whatsApp.js' 


const app  = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
})

//Middlewares
app.use(cors({credentials:true, origin:"http://localhost:3000"}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use((req,res,next)=>{logger.info(req.method,req.url); next();})

//Routers
app.use('/api/session',sessionRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter);
app.use('/api/users',usersRouter);

//WebSockets
let connectedSockets = {};
io.on('connection', async socket=>{
    console.log("client connected");
    if(socket.handshake.query.name){
        if(Object.values(connectedSockets).some(user=>user.id===socket.handshake.query.id)){
            Object.keys(connectedSockets).forEach(idSocket =>{
                if(connectedSockets[idSocket].id===socket.handshake.query.id){
                    delete connectedSockets[idSocket];
                    connectedSockets[socket.id]={
                        name:socket.handshake.query.name,
                        id:socket.handshake.query.id,
                        thumbnail:socket.handshake.query.thumbnail
                    };
                }
            })
        }else{
            connectedSockets[socket.id]={
                name:socket.handshake.query.name,
                id:socket.handshake.query.id,
                thumbnail:socket.handshake.query.thumbnail
            };
        }
    }
    io.emit('users',connectedSockets)
    let logs = await messageService.getAllAndPopulate();
    io.emit('logs',logs);

    
    socket.on('disconnect',reason=>{
        delete connectedSockets[socket.id]
    })
    socket.on('message',async data=>{
        if(Object.keys(connectedSockets).includes(socket.id)){
            await messageService.save({
                author:connectedSockets[socket.id].id,
                content: data
            })
            let logs = await messageService.getAllAndPopulate();
            io.emit('logs',logs);
        }
    });
})

//Informacion
app.get('/api/info/', (req, res) => {
    const info = {
      argumentos: argProcesados,
      rutaEjecucion: process.execPath,
      platforma: process.platform,
      version: process.version,
      direccionProyecto: process.cwd(),
      memoriaReservada: process.memoryUsage().rss,
      procesadores: core.cpus().length, 
      idProceso: process.pid,
    };
    res.send(info);
  });

//Comunicacion
app.get('/api/mail/', (req, res) => {
    mailing().then(result=>{
      res.send(result);
      console.log(result.message);
    });
  });
  app.get('/api/sms/', (req, res) => {
    smsing().then(result=>{
      res.send(result);
      console.log(result.message);
    });
  });
  app.get('/api/wsp/', (req, res) => {
    wsping().then(result=>{
      res.send(result);
      console.log(result.message);
    });
  });


    //Ruta no autorizada
app.use((req,res,next)=>{
    res.status(404).send({message:"La ruta que desea ingresar no existe"}) 
    logger.warn(req.method,req.url,"La ruta que desea ingresar no existe" );
})