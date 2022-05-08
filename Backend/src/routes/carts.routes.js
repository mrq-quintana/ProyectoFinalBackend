import express from 'express';
import cartController from '../controllers/carts.controller.js'

const router = express.Router();

router.get('/:cid',cartController.getCartById)
router.post('/:cid/products/:pid',cartController.addProduct)
router.post('/:id', cartController.deleteCartById)

export default router;