import { Sequelize } from "sequelize-typescript"
import InvoiceModel from "../repository/invoice.model"
import InvoiceItemModel from "../repository/invoice-item.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import Address from "../../@shared/domain/entity/address"


describe("Invoice Facade test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })
    it("should create a invoice", async () => {
        const facade = InvoiceFacadeFactory.create();

        const input = {
            name: "invoice",
            document: "document",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            ),
            items: [{
                id:"id1",
                name: "name1",
                price: 1
            }]
        }

        const invoiceSave = await facade.generate(input);

        const invoice = await facade.find({ id: invoiceSave.id })

        expect(invoice).toBeDefined()
        expect(invoice.name).toBe(input.name)
    });
})