import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../../product-adm/repository/product.model";
import { productRouter } from "../../../product-adm/api/routes/product.route";
import { ClientModel } from "../../../client-adm/repository/client.model";
import { clientAdmRouter } from "../../../client-adm/api/routes/client-adm.router";

export const app: Express = express();
app.use(express.json());
app.use("/product", productRouter)
app.use("/client-adm", clientAdmRouter)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    })
    await sequelize.addModels([ProductModel, ClientModel]);
    await sequelize.sync();
}

setupDb();