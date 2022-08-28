"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const fs = __importStar(require("fs"));
const findDevices_1 = require("./bluetooth/findDevices");
const moveDesk_1 = require("./bluetooth/moveDesk");
commander_1.program
    .name("deskCLI")
    .description("A CLI for a bluetooth connection for the standing desks at the IGent tower.")
    .version("1.0.0");
//connect => list all bluetooth devices and select 1
commander_1.program.command("connect")
    .description("Option to select your desk.")
    .action(() => {
    console.log("Looking for devices");
    (0, findDevices_1.findDevices)().then((devices) => {
        if (devices.length == 0) {
            return;
        }
        let choices = new Array();
        let i = 0;
        for (const device of devices) {
            choices.push({ key: i, name: device.name, value: device.UUID });
        }
        inquirer_1.default.prompt({
            type: 'list',
            name: 'device',
            message: 'Choose a device from the list.',
            choices: choices
        }).then((answers) => {
            try {
                fs.writeFileSync('saveFiles/device.json', JSON.stringify(answers));
            }
            catch (e) {
                fs.mkdir("saveFiles", () => {
                    fs.writeFileSync('saveFiles/device.json', JSON.stringify(answers));
                });
            }
            process.exit();
        });
    });
});
//configure => set standing and sitting height
commander_1.program.command("configure")
    .description("Option to configure the sitting and standing heights.")
    .option("--standing", "Option to only configure the standing height")
    .option("--sitting", "Option to only configure the sitting height")
    .action((options) => {
    let saveData;
    try {
        saveData = JSON.parse(fs.readFileSync("saveFiles/preferredHeight.json").toString());
    }
    catch (e) {
        saveData = { standingHeight: 135, sittingHeight: 92 };
    }
    let questions = new Array();
    if (options.standing || !options.sitting) {
        questions.push({ type: 'input', name: 'standingHeight', message: 'What is your standing desk height in cm?', default: saveData.standingHeight });
    }
    if (options.sitting || !options.standing) {
        questions.push({ type: 'input', name: 'sittingHeight', message: 'What is your sitting desk height in cm?', default: saveData.sittingHeight });
    }
    inquirer_1.default.prompt(questions).then((answers) => {
        if (answers.standingHeight) {
            saveData.standingHeight = answers.standingHeight;
        }
        if (answers.sittingHeight) {
            saveData.sittingHeight = answers.sittingHeight;
        }
        try {
            fs.writeFileSync('saveFiles/preferredHeight.json', JSON.stringify(saveData));
        }
        catch (e) {
            fs.mkdir("saveFiles", () => {
                fs.writeFileSync('saveFiles/preferredHeight.json', JSON.stringify(saveData));
            });
        }
    });
});
//stand => move to standing height
commander_1.program.command("stand")
    .description("Option to move the desk to the standing height.")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let height;
    try {
        height = JSON.parse(fs.readFileSync("saveFiles/preferredHeight.json").toString()).standingHeight;
    }
    catch (e) {
        console.error("No preferredHeight.json file found, run the 'configure' option first (check --help for more info)");
        process.exit();
    }
    let device;
    try {
        device = JSON.parse(fs.readFileSync("saveFiles/device.json").toString()).device;
    }
    catch (e) {
        console.error("No device.json file found, run the 'connect' option first (check --help for more info)");
        process.exit();
    }
    yield (0, moveDesk_1.moveDesk)(device, height);
}));
//sit => move to sitting height
commander_1.program.command("sit")
    .description("Option to move the desk to the sitting height.")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    let height;
    try {
        height = JSON.parse(fs.readFileSync("saveFiles/preferredHeight.json").toString()).sittingHeight;
    }
    catch (e) {
        console.error("No preferredHeight.json file found, run the 'configure' option first (check --help for more info)");
        process.exit();
    }
    let device;
    try {
        device = JSON.parse(fs.readFileSync("saveFiles/device.json").toString()).device;
    }
    catch (e) {
        console.error("No device.json file found, run the 'connect' option first (check --help for more info)");
        process.exit();
    }
    yield (0, moveDesk_1.moveDesk)(device, height);
}));
//move + number => move to defined height
commander_1.program.command("move <height>")
    .description("Option to move the desk to a certain height (in cm).")
    .action((heightStr) => __awaiter(void 0, void 0, void 0, function* () {
    let height;
    try {
        height = Number.parseInt(heightStr);
    }
    catch (e) {
        console.error("Not a number");
        process.exit();
    }
    let device;
    try {
        device = JSON.parse(fs.readFileSync("saveFiles/device.json").toString()).device;
    }
    catch (e) {
        console.error("No device.json file found, run the 'connect' option first (check --help for more info)");
        process.exit();
    }
    yield (0, moveDesk_1.moveDesk)(device, height);
}));
commander_1.program.parse();
