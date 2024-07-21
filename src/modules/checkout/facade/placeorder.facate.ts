import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PlaceOrderFacadeInterface, { PlaceOrderFacadeInputDto } from "./placeorder.facate.interface";

export interface UseCaseProps {
    addUsecase: UseCaseInterface;
  }

export default class PlaceOrderFacade implements PlaceOrderFacadeInterface {

    private _addUsecase : UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._addUsecase = usecaseProps.addUsecase;
    }

    async add(input: PlaceOrderFacadeInputDto): Promise<void> {
        return await this._addUsecase.execute(input);
    }

}