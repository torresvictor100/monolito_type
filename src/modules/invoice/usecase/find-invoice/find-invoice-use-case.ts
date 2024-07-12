import InvoiceGateway from "../../gateway/invoice-gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto-use-case";


export default class FindInvoiceUseCase {

    private _invoiceRepository : InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway){
        this._invoiceRepository = invoiceRepository;    
    }

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO>{
        const findInvoice = await this._invoiceRepository.find(input.id);

        return {
            id: findInvoice.id.id,
            name: findInvoice.name,
            document: findInvoice.document,
                address: {
                    street: findInvoice.address.street,
                    number: findInvoice.address.number,
                    complement: findInvoice.address.complement,
                    city: findInvoice.address.city,
                    state: findInvoice.address.state,
                    zipCode: findInvoice.address.zipCode,
                },
            items: findInvoice.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: findInvoice.getTotal(),
            createdAt: findInvoice.createdAt
        };
    }
}