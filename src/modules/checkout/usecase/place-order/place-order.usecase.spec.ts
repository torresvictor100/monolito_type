import { number, string } from "yup";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { IsEmail } from "sequelize-typescript";

const mockDate = new Date(2000, 1, 1);
describe("PlaceOrderUseCase", ()=> {

    describe("validateProducts methos", () => {
        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw erro if no product are select", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [],
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("No products selected")
            );
        })

        it("should throw an error when product os out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: {productId: string}) => {
                    return Promise.resolve({
                        productId,
                        stock: productId === "1"? 0 : 1,
                    })
                }),
            };

            //@ts-expect-error - force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{productId: "1"}]
            }

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );

            input = {
                clientId: "0",
                products: [{productId:"0"}, {productId:"1"}]
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "0",
                products: [{productId:"0"}, {productId:"1"}, {productId:"2"}]
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("Product 1 is not available in stock")
            );

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe("getProduct method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(()=>{
            jest.useRealTimers();
        });

        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
                new Error("Product not found")
            );
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "describe",
                    purchasePrice: 10,
                    stock: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            }

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description: "describe",
                    salesPrice: 10,
                })
            );

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });
    });

    describe("execute method", () => {

        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(()=>{
            jest.useRealTimers();
        });

        it("should thorw an error when client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {clientId: "0", products: []};

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("Client not found")
            );
        });

        it("should throw an error when products are not valid", async () => {

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest
            //@ts-expect-error -spy on private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - not return never
            .mockRejectedValue(new Error("No products selected"));

            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {clientId: "1", products: []};

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            );

            expect(mockValidateProducts).toBeCalledTimes(1);
        });

        describe("place an order", () => {
            const ClientProps = {
                id: "1c",
                name: "Client 0",
                document: "0000",
                email: "cliente@user.com",
                address: {
                    street: "street",
                    number: "1",
                    complement: "",
                    city: "city",
                    state: "some state",
                    zipCode: "0000"
                }
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(ClientProps),
            };

            const mockPaymentFacade = {
                process: jest.fn(),
            }

            const mockCheckoutRepo = {
                addOrder : jest.fn(),
            }

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({id:"1i"})
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepo as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product1",
                    description: "description1",
                    salesPrice: 40,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product2",
                    description: "description2",
                    salesPrice: 80,
                })
            };

            const mockValidateProducts = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "validateProducts")
            //@ts-expect-error - spy on private method
            .mockResolvedValue(null);

            const mockGetProduct = jest
            //@ts-expect-error - spy on private method
            .spyOn(placeOrderUseCase, "getProduct")
             //@ts-expect-error - spy on private method
            .mockImplementation((productId: keyof typeof products) => {
                return products[productId];
            })

            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
        
                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{ productId: "1" }, { productId: "2" }],
                };
        
                let output = await placeOrderUseCase.execute(input);
        
                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(120);
                expect(output.products).toStrictEqual(
                    [{ productId: "1" }, { productId: "2" }]
                );
        
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
        
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            });

            it("should be approved", async () => {

                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{productId:"1"},{productId: "2"}]
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.total).toBe(120)
                expect(output.products).toStrictEqual([
                    {productId: "1"},{productId: "2"}
                ]);

                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });
                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
            });
        })
    });
});