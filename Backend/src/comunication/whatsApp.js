import twilio from "twilio";

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(sid,token);

export async function wsping(){
    try{
        const message = await client.messages.create({
            body:"Hola esto es un whatsApp de prueba de Maxi Quintana",
            from:"whatsapp:+14155238886",
            to: process.env.WHATSAPP,
            // mediaUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZe8xjSlSEI8a1SK92Jay9sPqJXumdLkVAAg&usqp=CAU"
        })
        console.log(message);
        return ({message: "Mensaje de whatsapp enviado",result: message});
    }catch(error){
        console.log(error);
        return ({message: "Error al enviar whatsapp",error: error});
    }
};