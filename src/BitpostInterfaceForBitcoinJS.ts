import { BitpostInterface} from "./Bitpostinterface"

export class BitpostInterfaceForBitcoinJS extends BitpostInterface{
    public constructor({wallettoken=null, apiKey=null, testnet=false}:
        {wallettoken?: string, apiKey?: string, testnet?: boolean}){
            super({wallettoken: wallettoken, apiKey: apiKey, testnet: testnet});
    
    }

    public getFeerates({maxFeerate, size=50, target=null, canReduceFeerate=true}:
        {maxFeerate: number, size?: number, target?: number, canReduceFeerate?: boolean}): Array<number>{
            let rawFeerates: Array<number> = super.getFeerates({maxFeerate: maxFeerate, size: size, target: target, canReduceFeerate: canReduceFeerate})
            return rawFeerates.map(f => Math.floor(f))
        }

}