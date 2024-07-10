import Address from "../../../@shared/domain/entity/address";
import FindInvoiceUseCase from "./find-invoice-use-case";

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
    getTotal: () => output.items.reduce((total, item) => total + item.price, 0),
    createdAt: 'createdAt'
}

const MockRepository = () => {
    return {
        save: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(output))
    }
}

describe("save Invoice use case unit test", () => {
    it("should find a invoice", async() => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);

        const input = {id: '1'}

        const result = await usecase.execute(input);

        expect(result.id).toBeDefined()
        expect(result.name).toEqual("invoice")

    });
});