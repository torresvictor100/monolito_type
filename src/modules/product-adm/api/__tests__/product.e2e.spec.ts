import { app, sequelize } from "../../../@shared/infrastructure/api/express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
        .post("/product")
        .send({
            name: "product",
            description: "description",
            purchasePrice: 1,
            stock: 1
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("product");
        expect(response.body.purchasePrice).toEqual(1);
        expect(response.body.stock).toEqual(1);
    });
});