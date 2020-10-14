"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitpostRequest = exports.BitpostInterface = void 0;
var request = require("sync-request");
var BitpostInterface = /** @class */ (function () {
    function BitpostInterface(_a) {
        var _b = _a.wallettoken, wallettoken = _b === void 0 ? null : _b, _c = _a.apiKey, apiKey = _c === void 0 ? null : _c, _d = _a.testnet, testnet = _d === void 0 ? false : _d;
        this.baseURL = null;
        this.wallettoken = null;
        this.apiKey = null;
        this.wallettoken = wallettoken;
        this.apiKey = apiKey;
        if (testnet) {
            this.baseURL = "https://testnet-api.bitpost.co";
        }
        else {
            this.baseURL = "https://api.bitpost.co";
        }
    }
    BitpostInterface.prototype.createBitpostRequest = function (rawTxs, targetInSeconds, delay, broadcast_lowest_feerate) {
        if (delay === void 0) { delay = 1; }
        if (broadcast_lowest_feerate === void 0) { broadcast_lowest_feerate = false; }
        return new BitpostRequest({
            rawTxs: rawTxs,
            targetInSeconds: targetInSeconds,
            baseURL: this.baseURL,
            apiKey: this.apiKey,
            wallettoken: this.wallettoken,
            delay: delay,
            broadcast_lowest_feerate: broadcast_lowest_feerate,
        });
    };
    BitpostInterface.prototype.getFeerates = function (_a) {
        var maxFeerate = _a.maxFeerate, _b = _a.size, size = _b === void 0 ? 50 : _b, _c = _a.target, target = _c === void 0 ? null : _c, _d = _a.canReduceFeerate, canReduceFeerate = _d === void 0 ? true : _d;
        var parameters = { maxfeerate: maxFeerate, size: size, canreducefee: canReduceFeerate };
        if (target)
            parameters['target'] = target;
        var response = request('GET', this.baseURL + '/feerateset', { qs: parameters });
        if (response.statusCode >= 400)
            throw "Failed to get feerates!";
        return JSON.parse(response.getBody('utf-8'))['data']['feerates'];
    };
    return BitpostInterface;
}());
exports.BitpostInterface = BitpostInterface;
var BitpostRequest = /** @class */ (function () {
    function BitpostRequest(_a) {
        var rawTxs = _a.rawTxs, targetInSeconds = _a.targetInSeconds, _b = _a.delay, delay = _b === void 0 ? 1 : _b, _c = _a.broadcast_lowest_feerate, broadcast_lowest_feerate = _c === void 0 ? false : _c, _d = _a.apiKey, apiKey = _d === void 0 ? null : _d, _e = _a.wallettoken, wallettoken = _e === void 0 ? null : _e, baseURL = _a.baseURL;
        this.delay = 1;
        this.broadcast_lowest_feerate = false;
        this.rawTxs = rawTxs;
        this.absolute_epoch_target = BitpostRequest.toEpoch(targetInSeconds);
        this.delay = delay;
        this.broadcast_lowest_feerate = broadcast_lowest_feerate;
        this.apiKey = apiKey;
        this.wallettoken = wallettoken;
        this.baseURL = baseURL;
    }
    BitpostRequest.toEpoch = function (rawTarget) {
        if (rawTarget < 100000000) {
            return Math.round(rawTarget + Date.now() / 1000);
        }
        else if (rawTarget > 10000000000) {
            return Math.round(rawTarget / 1000);
        }
        else {
            return rawTarget;
        }
    };
    BitpostRequest.prototype.createQueryString = function () {
        var query = { target: this.absolute_epoch_target, delay: this.delay };
        if (this.broadcast_lowest_feerate)
            query['broadcast'] = 0;
        if (this.wallettoken)
            query['wallettoken'] = this.wallettoken;
        if (this.apiKey)
            query['key'] = this.apiKey;
        return query;
    };
    BitpostRequest.prototype.sendRequest = function (printBefore, printAfter) {
        if (printBefore === void 0) { printBefore = true; }
        if (printAfter === void 0) { printAfter = true; }
        var queryString = this.createQueryString();
        if (printBefore) {
            console.log('Sending ' + this.rawTxs.length + ' signed transactions');
            console.log(this.baseURL + '/request' + " , parameters=" + JSON.stringify(queryString));
        }
        var response = request('POST', this.baseURL + '/request', { qs: queryString, body: JSON.stringify(this.rawTxs) });
        try {
            this.answer = JSON.parse(Buffer.from(response.body, 'utf-8').toString());
        }
        catch (_a) { }
        if (response.statusCode < 400)
            this.id = this.answer['data']['id'];
        if (printAfter) {
            console.log('status code=' + response.statusCode);
            console.log(JSON.stringify(this.answer));
        }
        return this.answer;
    };
    return BitpostRequest;
}());
exports.BitpostRequest = BitpostRequest;
