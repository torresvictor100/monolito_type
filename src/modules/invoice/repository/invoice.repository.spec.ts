import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import Address from "../../@shared/domain/entity/address";
import InvoiceRepository from "./invoice.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/InvoiceItems";
import Invoice from "../domain/Invoice";


describe("Invoice Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
    })

    sequelize.addModels([InvoiceModel
        , InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a Invoice", async () => {

        const address = new Address(
            "street",
            "number",
            "complement",
            "city",
            "state",
            "zipCode"
        );
    
        const items = [
            new InvoiceItems({ id: new Id("2"), name: "name1", price: 1 }),
            new InvoiceItems({ id: new Id("3"), name: "name2", price: 2 })
        ];
    
        const invoice = new Invoice({
            id: new Id("1"),
            name: "invoice",
            document: "document",
            address: address,
            items: items
        });

        const repository = new InvoiceRepository()
        
        await repository.save(invoice)

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" } })

        expect(invoiceDb).toBeDefined()
        expect(invoiceDb.id).toEqual(invoiceDb.id)
        expect(invoice.items[0].name).toEqual('name1')
        expect(invoice.items[1].name).toEqual('name2')

    });
});