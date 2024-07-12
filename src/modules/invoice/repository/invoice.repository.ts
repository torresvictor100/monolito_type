import Address from "../../@shared/domain/entity/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/Invoice";
import InvoiceItems from "../domain/InvoiceItems";
import InvoiceGateway from "../gateway/invoice-gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";


export default class InvoiceRepository implements InvoiceGateway{
    async save(input: Invoice): Promise<Invoice> {

        await InvoiceModel.create({
            id: input.id.id,
            name: input.name,
            document: input.document,
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            city: input.address.city,
            state: input.address.state,
            zipcode: input.address.zipCode,
            items: input.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        }, {
            include: [{model: InvoiceItemModel }]
        });

        return new Invoice({
            id: input.id,
            name: input.name,
            document: input.document,
            address: input.address,
            items: input.items
        })
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({ 
            where: { id: id },
            include: ['items'] 
        });
        
        if (!invoice){
            throw new Error("Invoice not found")
        }

        return new Invoice({
            id: new Id(invoice.id),
            name:invoice.name,
            document:invoice.document,
            address: new Address (
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipcode
            ),
            items: invoice.items.map((item) => 
                new InvoiceItems({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price
                })
            ) 
        })
    }

}