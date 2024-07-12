import InvoiceFacade from "../facate/invoice.facate";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice-use-case";
import GenerationInvoiceUseCase from "../usecase/generation-invoice/generation-invoice-use-case";


export default class InvoiceFacadeFactory {
    static create() {
        const repository = new InvoiceRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(repository);
        const generationInvoiceUseCase = new GenerationInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            findUsecase: findInvoiceUseCase,
            generationUsecase: generationInvoiceUseCase,
        });
    
        return facade;
    }
}