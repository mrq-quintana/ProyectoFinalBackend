import { cartService, productService} from "../services/services.js";

const getCartById = async(req,res) =>{
    let id = req.params.cid;
    let cart = await cartService.getByWithPopulate({_id:id})
    res.send({status:"success",payload:cart})
}
const addProduct = async(req,res)=>{
    let {cid,pid} = req.params;
    let {quantity} = req.body;
    //Existe el producto?
    let product = await productService.getBy({_id:pid});
    if(!product) return res.status(404).send({status:"error",error:"Product not found"});
    //Existe el carrito?
    let cart = await cartService.getBy({_id:cid});
    if(!cart) return res.status(404).send({status:"error",error:"Cart not found"});
    //Hay stock?
    if(product.stock===0) return res.status(400).send({status:"error",error:"No stock"});
    //Restar stock
    product.stock = product.stock - quantity;
    await productService.update(product);
    //Add product to cart
    cart.products.push({product:pid,quantity});
    await cartService.update(cart);
    res.send({status:"success",message:"Product added"})
}
const deleteCartById = async(req,res) =>{
    const _id = req.params.id;
    let cart = await cartService.delete({_id});
        res.send(cart);
};

export default {
    getCartById,
    addProduct,
    deleteCartById
}