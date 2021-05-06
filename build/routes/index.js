"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var routes = express_1.default.Router();
routes.get('/', function (req, res) {
    res.sendFile(path_1.default.resolve('views', 'index.html'));
});
exports.default = routes;
