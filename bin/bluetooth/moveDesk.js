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
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveDesk = void 0;
const node_ble_1 = require("node-ble");
function moveDesk(uuid, height) {
    return __awaiter(this, void 0, void 0, function* () {
        const { bluetooth, destroy } = (0, node_ble_1.createBluetooth)();
        const adapter = yield bluetooth.defaultAdapter();
        adapter.waitDevice(uuid).then((device) => __awaiter(this, void 0, void 0, function* () {
            console.log("moving desk: " + (yield device.getName()) + " to height: " + height + " cm");
            //TODO send moving signals
            process.exit();
        }));
    });
}
exports.moveDesk = moveDesk;
