import Invoice from "../domain/Invoice";

export default interface InvoiceGateway {
    save(input: Invoice): Promise<Invoice>;
    find(id: string): Promise<Invoice>;
}