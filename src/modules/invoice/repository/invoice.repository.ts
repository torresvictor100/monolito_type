import Invoice from "../domain/Invoice";
import InvoiceGateway from "../gateway/invoice-gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";


export default class InvoiceRepository implements InvoiceGateway{
    async save(input: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: input.id.id,
            name: input.name,
            document: input.document,
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            city: input.address.city,
            state: input.address.state,
            zipcode: input.address._zipCode,
            items: input.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price,
            })),
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        }, {
            include: [{model: InvoiceItemModel, as: 'items'}]
        });
    }
    find(id: string): Promise<Invoice> {
        throw new Error("Method not implemented.");
    }

}