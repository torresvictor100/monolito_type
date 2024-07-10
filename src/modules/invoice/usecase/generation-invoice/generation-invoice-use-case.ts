import Address from "../../../@shared/domain/entity/address";
import Invoice from "../../domain/Invoice";
import InvoiceItems from "../../domain/InvoiceItems";
import InvoiceGateway from "../../gateway/invoice-gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generation-invoice-use-case.dto";


export default class GenerationInvoiceUseCase {
    private _invoiceRepository : InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway){
        this._invoiceRepository = invoiceRepository;    
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const items = input.items.map(itemDto => {
            return new InvoiceItems({
                name: itemDto.name,
                price: itemDto.price
            });
        });

        const invoice = new Invoice({
            name: input.name,
            document: input.document,
            address: new Address (
                input.street,
                input.number,
                input.complement,
                input.city,
                input.state,
                input.zipCode,
            ),
            items: items
        });

        const savedInvoice = await this._invoiceRepository.save(invoice);

        return {
            id: savedInvoice.id.id,
            name: savedInvoice.name,
            document: savedInvoice.document,
            street: savedInvoice.address.street,
            number: savedInvoice.address.number,
            complement: savedInvoice.address.complement,
            city: savedInvoice.address.city,
            state: savedInvoice.address.state,
            zipCode: savedInvoice.address.zipCode,
            items: savedInvoice.items.map(item => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: savedInvoice.getTotal(),
        };
    }
}