import { app, sequelize } from "../../../@shared/infrastructure/api/express";
import request from "supertest";


describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {

        const response = await request(app)
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

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("name");
        expect(response.body.address._city).toEqual("city");

    });
});