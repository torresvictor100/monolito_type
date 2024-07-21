import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../../product-adm/repository/product.model";
import { ClientModel } from "../../../client-adm/repository/client.model";
import { clientAdmRouter } from "../../../client-adm/api/routes/client-adm.router";
import { checkoutRouter } from "../../../checkout/api/routes/placeorder.router";
import { productRouter } from "../../../product-adm/api/routes/product.route";
import TransactionModel from "../../../payment/repository/transaction.model";
import { OrderModel } from "../../../checkout/repository/order.model";
import InvoiceModel from "../../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../../invoice/repository/invoice-item.model";
import { ProductSalesModel } from "../../../checkout/repository/product-sales.model";
import { invoiceRouter } from "../../../invoice/api/routes/invoice.router";

export const app: Express = express();
app.use(express.json());
app.use("/product", productRouter)
app.use("/client-adm", clientAdmRouter)
app.use("/checkout", checkoutRouter)
app.use("/invoice", invoiceRouter)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    })
    await sequelize.addModels([ProductSalesModel, OrderModel, ProductModel, ClientModel
        , TransactionModel, InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
}

setupDb();