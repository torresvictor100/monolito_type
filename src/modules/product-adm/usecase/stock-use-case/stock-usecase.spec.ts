import AddProductUseCase from "../add-product/add-product.usecase";
import StockUseCase from "./stock-usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockResolvedValue({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            stock: 10,
        }),
    };
};

describe("Consult stoke for product usecase unit test", () => {
    it("consult stoke", async () => {

        const productRepository = MockRepository();

        const usecasecreate = new AddProductUseCase(productRepository);

        const inputcreate = {
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
        };

        const resultcreate = await usecasecreate.execute(inputcreate);

        expect(productRepository.add).toHaveBeenCalled();
        expect(resultcreate.id).toBeDefined;


        const usecase = new StockUseCase(productRepository);

        const inputstoke = {
            id: resultcreate.id,
        };

        const result = await usecase.execute(inputstoke);

        expect(productRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined;
        expect(result.stock).toBe(10);

    })
});
