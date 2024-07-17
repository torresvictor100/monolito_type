import express, {Request, Response} from "express";
import ClientAdmFacadeFactory from "../../factory/client-adm.facade.factory";
import Address from "../../../@shared/domain/entity/address";

export const clientAdmRouter = express.Router();

clientAdmRouter.post('/', async (req: Request, res: Response) => {
    const clientAdmFacade = ClientAdmFacadeFactory.create();

    try {
        const clientAdmDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: new Address(
                req.body.address.street,
                req.body.address.number,
                req.body.address.complement,
                req.body.address.city,
                req.body.address.state,
                req.body.address.zipCode,
            )
        }

        const output = await clientAdmFacade.add(clientAdmDto)
        res.send(output);
    }catch(err){
        res.status(500).send(err);
    }
});