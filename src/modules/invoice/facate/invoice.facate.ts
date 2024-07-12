import Address from "../../@shared/domain/entity/address";
import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";


export interface UseCaseProps {
    findUsecase: UseCaseInterface;
    generationUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUsecase: UseCaseInterface;
    private _generationUsecase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._findUsecase = usecaseProps.findUsecase;
        this._generationUsecase = usecaseProps.generationUsecase;
    }

    generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {

        return this._generationUsecase.execute({
            name: input.name,
            document:input.document,
            street: input.address.street,
            number: input.address.number,
            complement: input.address.number,
            city: input.address.city,
            state:input.address.state,
            zipCode: input.address.zipCode,
            items: input.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price
            }))
        });
    }

    async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {

        return await this._findUsecase.execute(input);
    }
    
}