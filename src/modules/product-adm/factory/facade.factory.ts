import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import { StockOutputDto } from "../usecase/stock-use-case/stock-use-case";
import StockUseCase from "../usecase/stock-use-case/stock-usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productRepository);
    const stockUseCase = new StockUseCase(productRepository);
    const productFacade = new ProductAdmFacade({
      addUseCase: addProductUseCase,
      stockUseCase: stockUseCase,
    });

    return productFacade;
  }

  static checkStock( productId: string): Promise<StockOutputDto> {
    const productRepository = new ProductRepository();
    const stockUseCase = new StockUseCase(productRepository);
    
    const product = stockUseCase.execute({id: productId})
    return product;
  }
}
