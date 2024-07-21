import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "productssales",
  timestamps: false,
})
export class ProductSalesModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
