import express, {Request, Response} from "express";
import PlaceOrderFacadeFactory from "../../factory/placeorder.facade.factory";
import { PlaceOrderInputDto } from "../../usecase/place-order/place-order.dto";

export const checkoutRouter = express.Router();

checkoutRouter.post('/', async (req: Request, res: Response) => {

    const checkOutFacade = PlaceOrderFacadeFactory.create();

    try {
        const checkOutDto: PlaceOrderInputDto = {
            clientId: req.body.clientId,
            products: req.body.products.map((product: { productId: string }) => ({
                productId: product.productId
            }))
        };

        const output = await checkOutFacade.execute(checkOutDto)
        res.send(output);
    }catch(err){
        res.status(500).send(err);
    }
});