import { BitpostInterface } from "./Bitpostinterface";
export declare class BitpostInterfaceForBitcoinJS extends BitpostInterface {
    constructor({ wallettoken, apiKey, testnet }: {
        wallettoken?: string;
        apiKey?: string;
        testnet?: boolean;
    });
    getFeerates({ maxFeerate, size, target, canReduceFeerate }: {
        maxFeerate: number;
        size?: number;
        target?: number;
        canReduceFeerate?: boolean;
    }): Array<number>;
}
