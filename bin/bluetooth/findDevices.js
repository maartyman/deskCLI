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
exports.findDevices = void 0;
const generalUtils_1 = require("../utils/generalUtils");
function findDevices() {
    return __awaiter(this, void 0, void 0, function* () {
        const { createBluetooth } = require('node-ble');
        const { bluetooth, destroy } = createBluetooth();
        const adapter = yield bluetooth.defaultAdapter();
        let devices = new Array();
        if (!(yield adapter.isDiscovering()))
            yield adapter.startDiscovery();
        adapter.devices().then((uuids) => {
            uuids.forEach((uuid) => {
                adapter.waitDevice(uuid).then((device) => __awaiter(this, void 0, void 0, function* () {
                    devices.push({ name: yield device.getName(), UUID: uuid.toString() });
                }));
            });
        });
        yield (0, generalUtils_1.sleep)(5000);
        yield adapter.stopDiscovery();
        return devices;
    });
}
exports.findDevices = findDevices;
