import twilio from "twilio"

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(sid,token);

export async function smsing(){
    try{
        const message = await client.messages.create({
            body:"Hola esto es un sms de prueba de Maxi Quintana",
            from:"+19105971760",
            to:"+5491150123519",
        })
        console.log(message);
        return ({message: "Mensaje de texto enviado",result: message});
    }catch(error){
        console.log(error);
        return ({message: "Error al enviar sms",error: error});
    }
};