import dotenv from 'dotenv';
import yargs from 'yargs';
dotenv.config();

const argumentos = yargs(process.argv.slice(2));
export const argProcesados = argumentos.options({
    port: {
      alias: "p",
      default: process.env.PORT || 8080,
      describe: "Escuchando en el puerto",
      type: "number",
    },
    mode: {
      alias: "m",
      default: "fork",
      describe: "Modo que corre el server",
      type: "string",
      choices: ["fork", "cluster"],
    },
  }).argv;

export default {

    PORT:argProcesados.port,
    MODE:argProcesados.mode,

    mongo:{
        url:process.env.MONGO_URL
    },
    aws:{
        ACCESS_KEY:process.env.AWS_ACCESS_KEY,
        SECRET:process.env.AWS_SECRET
    },
    jwt:{
        cookie_name:process.env.JWT_COOKIE_NAME,
        secret:process.env.JWT_SECRET
    },
    session:{
        SUPERADMIN:process.env.SUPERADMIN,
        SUPERADMIN_PASSWORD:process.env.SUPERADMIN_PASSWORD
    }
}