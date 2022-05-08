import { productService } from "../services/services.js"

const getAllProducts = async(req,res)=>{
    let products = await productService.getAll();
    res.send({status:"success",payload:products})
}
const getProductById = async(req,res)=>{
    let id = req.params.pid;
    let product = await productService.getBy({_id:id})
    if(!product) res.status(404).send({status:"error",error:"Not found"})
    res.send({status:"success",payload:product})
}
const saveProduct = async (req, res) => {
    let productoAgregar = req.body;
    let thumbnail = req.file.location;
    productoAgregar.thumbnail = thumbnail;
    productService.save(productoAgregar).then((result) => {
      res.send(result);
    });
  };
  const deleteProductById = async(req,res) =>{
      const _id = req.params.id;
      let product = await productService.delete({_id});
          res.send(product);
  };
  const updateProductById = async(req,res)=>{
      let id = req.params.pid;
      let body = req.body;
      console.log(id)
      console.log(req.body)
      let product = await productService.update(id,body)
          res.send(product);
  };
  const deleteAll = async(req,res)=>{
      let products = await productService.deleteAll();
      res.send(products);
  }

export default {
    getAllProducts,
    getProductById,
    saveProduct,
    deleteProductById,
    updateProductById,
    deleteAll
}