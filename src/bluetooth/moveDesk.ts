import {createBluetooth, Device} from "node-ble";


export async function moveDesk(uuid: string, height: number) {
  const {bluetooth, destroy} = createBluetooth();
  const adapter = await bluetooth.defaultAdapter();

  adapter.waitDevice(uuid).then(async (device: Device) => {
      console.log("moving desk: " + await device.getName() + " to height: " + height + " cm");
      //TODO send moving signals
      process.exit();
  });
}
