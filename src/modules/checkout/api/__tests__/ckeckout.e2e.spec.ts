import { app, sequelize } from "../../../@shared/infrastructure/api/express";
import request from "supertest";

describe("E2E test for checkout", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create ckeckout ", async () => {

        const responseClient = await request(app)
        .post("/client-adm")
        .send({
            name: "name",
            email: "email@gmail.com",
            document: "document",
            address: {
                street: "Street",
                number:"123",
                complement: "complement",
                city: "city",
                state: "state",
                zipCode: "12345",
            },
        });

        expect(responseClient.status).toBe(200);
        expect(responseClient.body.name).toEqual("name");
        expect(responseClient.body.address._city).toEqual("city");
        

        const responseProduct = await request(app)
        .post("/product")
        .send({
            name: "product",
            description: "description",
            purchasePrice: 1000,
            stock: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        expect(responseProduct.status).toBe(200);
        expect(responseProduct.body.name).toEqual("product");
        expect(responseProduct.body.purchasePrice).toEqual(1000);


        const response = await request(app)
        .post("/checkout")
        .send({
            clientId: responseClient.body.id,
            products: [{productId: responseProduct.body.id}]
        });


        expect(response.status).toBe(200);

        console.log(response.body)
    });

});