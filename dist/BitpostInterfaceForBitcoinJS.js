"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitpostInterfaceForBitcoinJS = void 0;
var Bitpostinterface_1 = require("./Bitpostinterface");
var BitpostInterfaceForBitcoinJS = /** @class */ (function (_super) {
    __extends(BitpostInterfaceForBitcoinJS, _super);
    function BitpostInterfaceForBitcoinJS(_a) {
        var _b = _a.wallettoken, wallettoken = _b === void 0 ? null : _b, _c = _a.apiKey, apiKey = _c === void 0 ? null : _c, _d = _a.testnet, testnet = _d === void 0 ? false : _d;
        return _super.call(this, { wallettoken: wallettoken, apiKey: apiKey, testnet: testnet }) || this;
    }
    BitpostInterfaceForBitcoinJS.prototype.getFeerates = function (_a) {
        var maxFeerate = _a.maxFeerate, _b = _a.size, size = _b === void 0 ? 50 : _b, _c = _a.target, target = _c === void 0 ? null : _c, _d = _a.canReduceFeerate, canReduceFeerate = _d === void 0 ? true : _d;
        var rawFeerates = _super.prototype.getFeerates.call(this, { maxFeerate: maxFeerate, size: size, target: target, canReduceFeerate: canReduceFeerate });
        return rawFeerates.map(function (f) { return Math.floor(f); });
    };
    return BitpostInterfaceForBitcoinJS;
}(Bitpostinterface_1.BitpostInterface));
exports.BitpostInterfaceForBitcoinJS = BitpostInterfaceForBitcoinJS;
