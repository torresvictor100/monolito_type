import { CreatedAt } from "sequelize-typescript";
import Address from "../../@shared/domain/entity/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";

import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";
import { ProductSalesModel } from "./product-sales.model";


export default class OrderRepository implements CheckoutGateway {
    async addOrder(input: Order): Promise<Order> {

        const orderModel = await OrderModel.create({
            id: input.id.id,
            clientId:input.client.id.id,
            products: input.products.map((product) => ({
                id: product.id.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            })),
            status: input.status,
        }, {
            include: [{model: ProductSalesModel }]
        })

        return new Order({
            id: input.id,
            client: input.client,
            products: input.products,
            status: input.status
        });
    }

    async findOrder(id: string): Promise<Order | null> {
        const order = await OrderModel.findOne({
            where: { id: id },
            include: ['products', 'client'] 
        })

        if (!order){
            throw new Error("Invoice not found")
        }

        return new Order ({
            id: new Id(order.id),
            client: new Client({
                id: new Id(order.clientId),
                name:order.client.name,
                email: order.client.email,
                document: order.client.document,
                address: new Address(
                    order.client.street,
                    order.client.number,
                    order.client.complement,
                    order.client.city,
                    order.client.state,
                    order.client.zipcode,
                ),
            }),
            products: order.products.map((product) => {
                return new Product({
                    id: new Id(product.id),
                    name: product.name,
                    description : product.description,
                    salesPrice: product.salesPrice
                })
            }),
            status: order.status
        });
    };
    
}