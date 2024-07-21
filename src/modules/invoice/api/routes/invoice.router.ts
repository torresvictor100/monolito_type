import express, {Request, Response} from "express";
import InvoiceFacadeFactory from "../../factory/invoice.facade.factory";


export const invoiceRouter = express.Router();

invoiceRouter.get('/:id', async (req: Request, res: Response) => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const { id } = req.params;

    try {
        const output = await invoiceFacade.find({id})
        res.send(output);
    }catch(err){
        res.status(500).send(err);
    }
});