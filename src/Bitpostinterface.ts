const request = require("sync-request");
export class BitpostInterface {
  baseURL: string = null;
  wallettoken: string = null;
  apiKey: string = null

  public constructor({wallettoken=null, apiKey=null, testnet=false}: 
    {wallettoken?: string, apiKey?: string, testnet?: boolean}){
    this.wallettoken = wallettoken
    this.apiKey = apiKey

    if(testnet){
      this.baseURL = "https://testnet-api.bitpost.co"
    } else {
      this.baseURL = "https://api.bitpost.co"
    }
  }

  public createBitpostRequest(rawTxs: Array<string>, targetInSeconds: number, delay: number = 1,
    broadcast_lowest_feerate = false): BitpostRequest {
    return new BitpostRequest({
      rawTxs: rawTxs,
      targetInSeconds: targetInSeconds,
      baseURL: this.baseURL,
      apiKey: this.apiKey,
      wallettoken: this.wallettoken,
      delay: delay,
      broadcast_lowest_feerate: broadcast_lowest_feerate,
    });
  }

  public getFeerates({maxFeerate, size=50, target=null, canReduceFeerate=true}:
    {maxFeerate: number, size?: number, target?: number, canReduceFeerate?: boolean}): Array<number>{
      let adjustedSize: number = Math.min(size, Math.floor(maxFeerate))
      let parameters: Object = {maxfeerate: maxFeerate, size: adjustedSize, canreducefee: canReduceFeerate}
      if(target) parameters['target'] = target
      let response = request('GET', this.baseURL + '/feerateset', {qs: parameters})
      if(response.statusCode >= 400) throw "Failed to get feerates!"
      return JSON.parse(response.getBody('utf-8'))['data']['feerates']
    }
}

export class BitpostRequest {
  apiKey: string;
  wallettoken: string;
  baseURL: string;

  rawTxs: Array<string>;
  absolute_epoch_target: number;
  delay: number = 1;
  broadcast_lowest_feerate: boolean = false;

  id: string;
  answer: JSON;

  public constructor({rawTxs, targetInSeconds, delay=1,
    broadcast_lowest_feerate=false, apiKey=null, wallettoken=null, baseURL
  }: {rawTxs: Array<string>, targetInSeconds: number, delay?: number, 
    broadcast_lowest_feerate?: boolean, wallettoken?: string, apiKey?: string,
  baseURL: string}) {
    this.rawTxs = rawTxs;
    this.absolute_epoch_target = BitpostRequest.toEpoch(targetInSeconds);
    this.delay = delay;
    this.broadcast_lowest_feerate = broadcast_lowest_feerate;
    this.apiKey = apiKey;
    this.wallettoken = wallettoken;
    this.baseURL = baseURL;
  }

  static toEpoch(rawTarget: number): number{
    if(rawTarget < 100_000_000){
      return Math.round(rawTarget + Date.now()/1000)
    } else if(rawTarget > 10_000_000_000){
      return Math.round(rawTarget/1000)
    } else {
      return rawTarget
    }
  }

  createQueryString(): Object {
    let query: Object = {target: this.absolute_epoch_target, delay: this.delay}
    if(this.broadcast_lowest_feerate) query['broadcast'] = 0 
    if(this.wallettoken) query['wallettoken'] = this.wallettoken 
    if(this.apiKey) query['key'] = this.apiKey 
    return query;
  }

  sendRequest(printBefore: boolean=true, printAfter: boolean=true): JSON {
    let queryString = this.createQueryString()
    
    if(printBefore){
      console.log('Sending ' + this.rawTxs.length + ' signed transactions')
      console.log(this.baseURL + '/request' + " , parameters=" + JSON.stringify(queryString))
    }
    
    let response = request('POST', this.baseURL + '/request', {qs: queryString, body: JSON.stringify(this.rawTxs)})
    try{
      this.answer = JSON.parse(Buffer.from(response.body,'utf-8').toString())
    } catch{}
    if(response.statusCode < 400) this.id = this.answer['data']['id']
    
    if(printAfter){
      console.log('status code=' + response.statusCode)
      console.log(JSON.stringify(this.answer))
    }
    
    return this.answer;
  }
}
