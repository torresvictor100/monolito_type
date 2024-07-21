
import ClientAdmFacade from "../../client-adm/facade/client-adm.facade";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ClientRepository from "../../client-adm/repository/client.repository";
import AddClientUseCase from "../../client-adm/usecase/add-client/add-client.usecase";
import FindClientUseCase from "../../client-adm/usecase/find-client/find-client.usecase";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacade from "../../product-adm/facade/product-adm.facade";
import ProductCatalogRepository from "../../store-catalog/repository/product.repository";
import ProductAdmRepository from "../../product-adm/repository/product.repository";
import AddProductUseCase from "../../product-adm/usecase/add-product/add-product.usecase";
import StockUseCase from "../../product-adm/usecase/stock-use-case/stock-usecase";
import StoreCatalogFacade from "../../store-catalog/facade/store-catalog.facade";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import FindProductUseCase from "../../store-catalog/usecase/find-product/find-product.usecase";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import FindAllProductsUsecase from "../../store-catalog/usecase/find-all-products/find-all-products.usecase";
import InvoiceRepository from "../../invoice/repository/invoice.repository";
import FindInvoiceUseCase from "../../invoice/usecase/find-invoice/find-invoice-use-case";
import GenerationInvoiceUseCase from "../../invoice/usecase/generation-invoice/generation-invoice-use-case";
import InvoiceFacade from "../../invoice/facate/invoice.facate";
import TransactionRepostiory from "../../payment/repository/transaction.repository";
import ProcessPaymentUseCase from "../../payment/usecase/process-payment/process-payment.usecase";
import PaymentFacade from "../../payment/facade/payment.facade";

export default class PlaceOrderFacadeFactory {

    

  
    static create() {

    const repository = new OrderRepository();

    const repositoryClient = new ClientRepository()
    const addUsecase = new AddClientUseCase(repositoryClient)
    const findUsecase = new FindClientUseCase(repositoryClient);
    const facadeClient = new ClientAdmFacade({
        addUsecase: addUsecase,
        findUsecase: findUsecase,
    })

    const productAdmRepository = new ProductAdmRepository();
    const addProductUseCase = new AddProductUseCase(productAdmRepository);
    const stockUseCase = new StockUseCase(productAdmRepository);
    const productFacade = new ProductAdmFacade({
        addUseCase: addProductUseCase,
        stockUseCase: stockUseCase,
    });

    const productCatalogRepository = new ProductCatalogRepository();
    const findUseCase = new FindProductUseCase(productCatalogRepository);
    const findAllUseCase = new FindAllProductsUsecase(productCatalogRepository);

    const catalogFacade = new StoreCatalogFacade({
        findUseCase: findUseCase,
        findAllUseCase: findAllUseCase,
    });


        const invoiceRepository = new InvoiceRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
        const generationInvoiceUseCase = new GenerationInvoiceUseCase(invoiceRepository);
        const invoiceFacade = new InvoiceFacade({
            findUsecase: findInvoiceUseCase,
            generationUsecase: generationInvoiceUseCase,
        });


        const transactionRepostiory = new TransactionRepostiory();
        const processPaymentUseCase = new ProcessPaymentUseCase(transactionRepostiory);
        const paymentFacade = new PaymentFacade(processPaymentUseCase);
        

        return new PlaceOrderUseCase(
            facadeClient,
            productFacade,
            catalogFacade,
            repository,
            invoiceFacade,
            paymentFacade,
        );
    }
}