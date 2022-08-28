import {program} from "commander";
import inquirer, {Question} from "inquirer";
import * as fs from "fs";
import {findDevices} from "./bluetooth/findDevices";
import {moveDesk} from "./bluetooth/moveDesk";

program
  .name("deskCLI")
  .description("A CLI for a bluetooth connection for the standing desks at the IGent tower.")
  .version("1.0.0")

//connect => list all bluetooth devices and select 1
program.command("connect")
  .description("Option to select your desk.")
  .action(() => {
    console.log("Looking for devices");

    findDevices().then((devices) => {
      if (devices.length == 0) {
        return;
      }

      let choices = new Array<({key: number, name: string, value: string})>();

      let i = 0;
      for (const device of devices) {
        choices.push({key: i, name: device.name, value: device.UUID});
      }

      inquirer.prompt(
        {
          type: 'list',
          name: 'device',
          message: 'Choose a device from the list.',
          choices: choices
        }
      ).then((answers: any) => {
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
program.command("configure")
  .description("Option to configure the sitting and standing heights.")
  .option("--standing", "Option to only configure the standing height")
  .option("--sitting", "Option to only configure the sitting height")
  .action((options) => {
    let saveData: { standingHeight: any; sittingHeight: any; };
    try {
      saveData = JSON.parse(fs.readFileSync("saveFiles/preferredHeight.json").toString());
    }
    catch (e) {
      saveData = { standingHeight: 135, sittingHeight: 92 };
    }

    let questions = new Array<Question>();
    if (options.standing || !options.sitting) {
      questions.push({ type: 'input', name: 'standingHeight',  message: 'What is your standing desk height in cm?', default: saveData.standingHeight});
    }
    if (options.sitting || !options.standing) {
      questions.push({ type: 'input', name: 'sittingHeight',  message: 'What is your sitting desk height in cm?', default: saveData.sittingHeight});
    }

    inquirer.prompt(
      questions
    ).then((answers: any) => {
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
program.command("stand")
  .description("Option to move the desk to the standing height.")
  .action(async () => {
    let height;
    try {
      height = JSON.parse(fs.readFileSync("saveFiles/preferredHeight.json").toString()).standingHeight;
    } catch (e) {
      console.error("No preferredHeight.json file found, run the 'configure' option first (check --help for more info)");
      process.exit();
    }

    let device;
    try {
      device = JSON.parse(fs.readFileSync("saveFiles/device.json").toString()).device;
    } catch (e) {
      console.error("No device.json file found, run the 'connect' option first (check --help for more info)");
      process.exit();
    }

    await moveDesk(device, height);
  });

//sit => move to sitting height
program.command("sit")
  .description("Option to move the desk to the sitting height.")
  .action(async () => {
    let height;
    try {
      height = JSON.parse(fs.readFileSync("saveFiles/preferredHeight.json").toString()).sittingHeight;
    } catch (e) {
      console.error("No preferredHeight.json file found, run the 'configure' option first (check --help for more info)");
      process.exit();
    }

    let device;
    try {
      device = JSON.parse(fs.readFileSync("saveFiles/device.json").toString()).device;
    } catch (e) {
      console.error("No device.json file found, run the 'connect' option first (check --help for more info)");
      process.exit();
    }

    await moveDesk(device, height);
  });

//move + number => move to defined height
program.command("move <height>")
  .description("Option to move the desk to a certain height (in cm).")
  .action(async (heightStr: string) => {
    let height;
    try {
      height = Number.parseInt(heightStr);
    } catch (e) {
      console.error("Not a number");
      process.exit();
    }

    let device;
    try {
      device = JSON.parse(fs.readFileSync("saveFiles/device.json").toString()).device;
    } catch (e) {
      console.error("No device.json file found, run the 'connect' option first (check --help for more info)");
      process.exit();
    }

    await moveDesk(device, height);
  });

program.parse();


