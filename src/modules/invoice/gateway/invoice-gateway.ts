import Invoice from "../domain/Invoice";

export default interface InvoiceGateway {
    save(input: Invoice): Promise<void>;
    find(id: string): Promise<Invoice>;
}