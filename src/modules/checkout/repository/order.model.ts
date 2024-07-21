import { BelongsTo, Column, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ProductModel } from "../../product-adm/repository/product.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductSalesModel } from "./product-sales.model";

@Table({
    tableName: 'order',
    timestamps: false
})
export class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    status: string

    @ForeignKey(() => ClientModel)
    @Column
    clientId: string;

    @BelongsTo(() => ClientModel)
    client: ClientModel;

    @HasMany(() => ProductSalesModel, 'orderId')
    products: ProductSalesModel[];
}