import { userService } from "../services/services.js"


const getUsers = async(req,res)=>{
    let users = await userService.getAll();
    res.send(users);
}
const getUserById =async(req,res)=>{
    const id = req.params.id
    let user = await userService.getBy({id})
    res.send(user);  
}
const saveUser = async(req,res)=>{
    let user = await userService.save(user);
    res.send(user);
}


export default{
    getUsers,
    getUserById,
    saveUser
}