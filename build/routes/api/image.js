"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileExtension = exports.isFilenameOnServer = void 0;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var sharp_1 = __importDefault(require("sharp"));
var fs_1 = require("fs");
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var image = express_1.default.Router();
var inputDir = 'images';
var outputDir = 'thumbs';
// template for images name: [filename][width]x[height].jpg or .png
image.post('/', express_fileupload_1.default(), function (req, res) {
    if (req.files && req.files.upload) {
        var uploadedFile = req.files.upload;
        uploadedFile.mv("./images/" + uploadedFile.name, function (err) {
            if (err)
                console.log(err);
        });
        console.log('uploaded file');
        res.redirect(200, '/');
    }
    else {
        console.log('no file');
        res.redirect(400, '/');
    }
});
function isFilenameOnServer(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var files, fileNames, found, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readdir(inputDir)];
                case 1:
                    files = _a.sent();
                    fileNames = files.map(function (file) { return file.split('.')[0]; });
                    found = fileNames.find(function (name) { return name == filename; });
                    if (found) {
                        return [2 /*return*/, true];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.isFilenameOnServer = isFilenameOnServer;
function getFileExtension(filename) {
    return __awaiter(this, void 0, void 0, function () {
        var files, reqfile, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readdir(inputDir)];
                case 1:
                    files = _a.sent();
                    reqfile = files.find(function (file) { return file.split('.')[0] == filename; });
                    return [2 /*return*/, reqfile === null || reqfile === void 0 ? void 0 : reqfile.split('.')[1]];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getFileExtension = getFileExtension;
image.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filename, width, height, fileExtension, error_3, error_4, path, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filename = req.query.filename;
                width = req.query.width;
                height = req.query.height;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 14]);
                // check if query is sufficient
                if (!filename || !width || !height) {
                    throw new Error('invalid query string');
                }
                return [4 /*yield*/, isFilenameOnServer(filename)];
            case 2:
                // check if requested filename is available
                if (!(_a.sent())) {
                    throw new Error('no equivalent filename on server!');
                }
                return [4 /*yield*/, getFileExtension(filename)];
            case 3:
                // get file extension
                fileExtension = _a.sent();
                console.log(fileExtension);
                // check if "thumbs" output directory exists
                return [4 /*yield*/, fs_1.promises.access(outputDir)];
            case 4:
                // check if "thumbs" output directory exists
                _a.sent();
                // check if thumb image already exists
                return [4 /*yield*/, fs_1.promises.access(outputDir + "/" + filename + width + "x" + height + "." + fileExtension)];
            case 5:
                // check if thumb image already exists
                _a.sent();
                // then send the file which is already there
                res.sendFile(path_1.default.resolve(outputDir + "/" + filename + width + "x" + height + "." + fileExtension));
                console.log('sent already processed image');
                return [2 /*return*/];
            case 6:
                error_3 = _a.sent();
                if (!(error_3.message == 'invalid query string' ||
                    error_3.message == 'no equivalent filename on server!')) return [3 /*break*/, 7];
                console.log(error_3.message);
                return [2 /*return*/, res.status(400).end(error_3.message)];
            case 7:
                if (!(error_3.code == 'ENOENT' &&
                    error_3.syscall == 'access' &&
                    error_3.path == outputDir)) return [3 /*break*/, 12];
                console.log("no output folder, let's create one ...");
                _a.label = 8;
            case 8:
                _a.trys.push([8, 10, , 11]);
                return [4 /*yield*/, fs_1.promises.mkdir(outputDir)];
            case 9:
                _a.sent();
                return [3 /*break*/, 11];
            case 10:
                error_4 = _a.sent();
                console.log(error_4);
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12:
                if (error_3.code == 'ENOENT' &&
                    error_3.syscall == 'access' &&
                    error_3.path ==
                        outputDir + "/" + filename + width + "x" + height + "." + fileExtension) {
                    console.log("directory exists, but file doesn't");
                }
                else {
                    console.log(error_3);
                }
                _a.label = 13;
            case 13: return [3 /*break*/, 14];
            case 14:
                _a.trys.push([14, 16, , 17]);
                path = path_1.default.resolve(inputDir + "/" + filename + "." + fileExtension);
                console.log('creating image');
                return [4 /*yield*/, sharp_1.default(path)
                        .resize(parseInt(width), parseInt(height))
                        .toFile(outputDir + "/" + filename + width + "x" + height + "." + fileExtension)];
            case 15:
                _a.sent();
                res.sendFile(path_1.default.resolve(outputDir + "/" + filename + width + "x" + height + "." + fileExtension));
                return [3 /*break*/, 17];
            case 16:
                error_5 = _a.sent();
                console.log(error_5);
                return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); });
exports.default = image;
