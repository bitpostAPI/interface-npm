export declare class BitpostInterface {
    baseURL: string;
    wallettoken: string;
    apiKey: string;
    constructor({ wallettoken, apiKey, testnet }: {
        wallettoken?: string;
        apiKey?: string;
        testnet?: boolean;
    });
    createBitpostRequest(rawTxs: Array<string>, targetInSeconds: number, delay?: number, broadcast_lowest_feerate?: boolean): BitpostRequest;
    getFeerates({ maxFeerate, size, target, canReduceFeerate }: {
        maxFeerate: number;
        size?: number;
        target?: number;
        canReduceFeerate?: boolean;
    }): Array<number>;
}
export declare class BitpostRequest {
    apiKey: string;
    wallettoken: string;
    baseURL: string;
    rawTxs: Array<string>;
    absolute_epoch_target: number;
    delay: number;
    broadcast_lowest_feerate: boolean;
    id: string;
    answer: JSON;
    constructor({ rawTxs, targetInSeconds, delay, broadcast_lowest_feerate, apiKey, wallettoken, baseURL }: {
        rawTxs: Array<string>;
        targetInSeconds: number;
        delay?: number;
        broadcast_lowest_feerate?: boolean;
        wallettoken?: string;
        apiKey?: string;
        baseURL: string;
    });
    static toEpoch(rawTarget: number): number;
    createQueryString(): Object;
    sendRequest(printBefore?: boolean, printAfter?: boolean): JSON;
}
