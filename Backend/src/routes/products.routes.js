import express from 'express';
import productsController from '../controllers/products.controller.js';
import { uploader } from '../utils.js';
const router = express.Router();


router.get('/',productsController.getAllProducts);
router.get('/:pid',productsController.getProductById)
//POST
router.post('/',uploader.single('thumbnail'), productsController.saveProduct)
//PUT
router.post('/:pid', productsController.updateProductById)
//DELETE
router.delete('/:id', productsController.deleteProductById)
router.delete('/', productsController.deleteAll)

export default router;