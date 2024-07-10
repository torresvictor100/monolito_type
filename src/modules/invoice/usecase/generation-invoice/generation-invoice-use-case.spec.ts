import Address from "../../../@shared/domain/entity/address";
import GenerationInvoiceUseCase from "./generation-invoice-use-case";

const output = {
    id: { id: "1" },
    name: "invoice",
    document: "document",
    address: new Address(
        "street",
        "number",
        "complement",
        "city",
        "state",
        "zipCode"
    ),
    items: [
    {
        id: { id: "2" },
        name: "name",
        price: 1
    },
    {
        id: { id: "3" },
        name: "name",
        price: 2
    }
    ],
    getTotal: () => output.items.reduce((total, item) => total + item.price, 0)
}


const MockRepository = () => {
    return {
        save: jest.fn().mockReturnValue(Promise.resolve(output)),
        find: jest.fn()
    }
}

describe("save Invoice use case unit test", () => {
    it("should save a invoice", async() => {
        const repository = MockRepository();
        const usecase = new GenerationInvoiceUseCase(repository);

        const input = {
            name: "invoice",
            document: "document",
            street: "street",
            number: "number",
            complement: "complement",
            city: "city",
            state: "state",
            zipCode: "zipCode",
            items: [{
                id:"id",
                name: "name",
                price: 1
            }]
        }


        const result = await usecase.execute(input);

        expect(repository.save).toHaveBeenCalled();
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
    });
});