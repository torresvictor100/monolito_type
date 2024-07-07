import Id from "../../../@shared/domain/value-object/id.value-object";


export interface StockInputDto {
    id: string;
}

export interface StockOutputDto {
    id: string;
    name: string;
    description: string;
    stock: number;
}