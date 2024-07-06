import ProductGateway from "../../gateway/product.gateway";
import { StockInputDto, StockOutputDto } from "./stock-use-case";


export default class StockUseCase{

    private _productRepository: ProductGateway;

    constructor(_productRepository: ProductGateway) {
        this._productRepository = _productRepository;
    }


    async execute(input: StockInputDto): Promise<StockOutputDto> {

        const product = await this._productRepository.find(input.id);

        return {
            id: product.id.id,
            name: product.name,
            description: product.description,
            stock: product.stock,
        }
    }

}