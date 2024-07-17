import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../../product-adm/repository/product.model";
import { productRouter } from "../../../product-adm/api/routes/product.route";

export const app: Express = express();
app.use(express.json());
app.use("/product", productRouter)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    })
    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
}

setupDb();