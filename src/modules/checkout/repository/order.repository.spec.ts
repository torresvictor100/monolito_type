import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "./order.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import Order from "../domain/order.entity";

import Id from "../../@shared/domain/value-object/id.value-object";
import OrderRepository from "./order.repository";
import Address from "../../@shared/domain/entity/address";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import { ProductSalesModel } from "./product-sales.model";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";



describe("Order Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
    })

    sequelize.addModels([OrderModel
        , ProductSalesModel, ClientModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })


    it("should create a Order", async () => {

        const client = new Client({
            id: new Id("1"),
            name: "Lucian",
            email: "lucian@teste.com",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
            )
        })

        const clientAdmFacade = ClientAdmFacadeFactory.create();

        clientAdmFacade.add( {
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            address: new Address(
                client.address.street,
                client.address.number,
                client.address.complement,
                client.address.city,
                client.address.state,
                client.address.zipCode,
            )
        });


        const order =  new Order({
            id: new Id("1"),
            client : client,
            products: [
            new Product({
                id: new Id("1"),
                name: "Product1",
                description: "description1",
                salesPrice: 40
            }),
            new Product({
                id: new Id("2"),
                name: "Product2",
                description: "description2",
                salesPrice: 40
            })
            ],
            status: "approved"
        })

        const repository = new OrderRepository();

        await repository.addOrder(order);

        const orderDb = await repository.findOrder(order.id.id);

        expect(orderDb).toBeDefined()
        expect(orderDb.client.name).toEqual(client.name)
        expect(orderDb.products[0].name).toEqual("Product1")
        expect(orderDb.products[1].description).toEqual("description2")

        
    });
});