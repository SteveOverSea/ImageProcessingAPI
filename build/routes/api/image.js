"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var sharp_1 = __importDefault(require("sharp"));
var image = express_1.default.Router();
image.get('/', function (req, res) {
    var path = path_1.default.resolve("images/" + req.query.filename + ".jpg");
    sharp_1.default(path)
        .resize(parseInt(req.query.width), parseInt(req.query.height))
        .toFile("thumb/" + req.query.filename + ".jpg", function (err) {
        console.log(err);
    });
    res.sendFile("thumb/" + req.query.filename + ".jpg");
});
exports.default = image;
