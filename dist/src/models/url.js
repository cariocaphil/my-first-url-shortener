"use strict";
// https://stackoverflow.com/questions/34482136/mongoose-the-typescript-way
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlSchema = void 0;
var mongoose = __importStar(require("mongoose"));
;
exports.UrlSchema = new mongoose.Schema({
    original: { type: String, required: true },
    short: Number
});
var Url = mongoose.model('Url', exports.UrlSchema);
exports.default = Url;
// let urlSchema = new mongoose.Schema({
//   original : {type: String, required: true},
//   short: Number
// })
// let Url = mongoose.model('Url', urlSchema);
//# sourceMappingURL=url.js.map