import Invoice from "../domain/Invoice";
import InvoiceGateway from "../gateway/invoice-gateway";


export default class InvoiceRepository implements InvoiceGateway{
    save(input: Invoice): Promise<Invoice> {
        throw new Error("Method not implemented.");
    }
    find(id: string): Promise<Invoice> {
        throw new Error("Method not implemented.");
    }

}