'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.QueryClientImpl = exports.QueryTopBalancesResponse = exports.QueryTopBalancesRequest = exports.protobufPackage = void 0
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
// const pagination_1 = require("../cosmos/base/query/v1beta1/pagination");
const pagination_1 = require('@cosmjs/stargate/build/codec/cosmos/base/query/v1beta1/pagination');
// const balance_1 = require("../cosmos/base/v1beta1/balance");
const balance_1 = require('./balance');
exports.protobufPackage = "telemetry";
const baseQueryTopBalancesRequest = { denom: "", desc: false };
exports.QueryTopBalancesRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.denom !== "") {
            writer.uint32(10).string(message.denom);
        }
        if (message.pagination !== undefined) {
            pagination_1.PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        if (message.desc === true) {
            writer.uint32(24).bool(message.desc);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryTopBalancesRequest);
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.denom = reader.string();
                    break;
                case 2:
                    message.pagination = pagination_1.PageRequest.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.desc = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryTopBalancesRequest);
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = String(object.denom);
        }
        else {
            message.denom = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        if (object.desc !== undefined && object.desc !== null) {
            message.desc = Boolean(object.desc);
        }
        else {
            message.desc = false;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        message.denom !== undefined && (obj.denom = message.denom);
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageRequest.toJSON(message.pagination)
                : undefined);
        message.desc !== undefined && (obj.desc = message.desc);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryTopBalancesRequest);
        if (object.denom !== undefined && object.denom !== null) {
            message.denom = object.denom;
        }
        else {
            message.denom = "";
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageRequest.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        if (object.desc !== undefined && object.desc !== null) {
            message.desc = object.desc;
        }
        else {
            message.desc = false;
        }
        return message;
    },
};
const baseQueryTopBalancesResponse = {};
exports.QueryTopBalancesResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        for (const v of message.balances) {
            balance_1.Balance.encode(v, writer.uint32(10).fork()).ldelim();
        }
        if (message.pagination !== undefined) {
            pagination_1.PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = Object.assign({}, baseQueryTopBalancesResponse);
        message.balances = [];
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.balances.push(balance_1.Balance.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.pagination = pagination_1.PageResponse.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        const message = Object.assign({}, baseQueryTopBalancesResponse);
        message.balances = [];
        if (object.balances !== undefined && object.balances !== null) {
            for (const e of object.balances) {
                message.balances.push(balance_1.Balance.fromJSON(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromJSON(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
    toJSON(message) {
        const obj = {};
        if (message.balances) {
            obj.balances = message.balances.map((e) => e ? balance_1.Balance.toJSON(e) : undefined);
        }
        else {
            obj.balances = [];
        }
        message.pagination !== undefined &&
            (obj.pagination = message.pagination
                ? pagination_1.PageResponse.toJSON(message.pagination)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = Object.assign({}, baseQueryTopBalancesResponse);
        message.balances = [];
        if (object.balances !== undefined && object.balances !== null) {
            for (const e of object.balances) {
                message.balances.push(balance_1.Balance.fromPartial(e));
            }
        }
        if (object.pagination !== undefined && object.pagination !== null) {
            message.pagination = pagination_1.PageResponse.fromPartial(object.pagination);
        }
        else {
            message.pagination = undefined;
        }
        return message;
    },
};
class QueryClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
    }
    TopBalances(request) {
        const data = exports.QueryTopBalancesRequest.encode(request).finish();
        const promise = this.rpc.request("telemetry.Query", "TopBalances", data);
        return promise.then((data) => exports.QueryTopBalancesResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.QueryClientImpl = QueryClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
