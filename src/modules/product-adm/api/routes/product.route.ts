
import express, {Request, Response} from "express";
import ProductRepository from "../../repository/product.repository";
import AddProductUseCase from "../../usecase/add-product/add-product.usecase";
import ProductAdmFacadeFactory from "../../factory/facade.factory";

export const productRouter = express.Router();

productRouter.post('/', async (req: Request, res: Response) => {
    //acho que é para usa o facede descobrir
    const productFacade = ProductAdmFacadeFactory.create();

    try {
        const productDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        }

        const output = await productFacade.addProduct(productDto);
        res.send(output);
    }catch(err){
        res.status(500).send(err);
    }
});