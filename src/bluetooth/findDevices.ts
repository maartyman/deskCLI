import {Device} from "node-ble";
import {sleep} from "../utils/generalUtils";

export async function findDevices(): Promise<Array<{ name: string, UUID: string }>> {
  const {createBluetooth} = require('node-ble');
  const {bluetooth, destroy} = createBluetooth();
  const adapter = await bluetooth.defaultAdapter();

  let devices = new Array<{name: string, UUID: string}>();

  if (! await adapter.isDiscovering())
    await adapter.startDiscovery();

  adapter.devices().then((uuids: String[]) => {
    uuids.forEach((uuid) => {
      adapter.waitDevice(uuid).then(
        async (device: Device) => {
          devices.push({name: await device.getName(), UUID: uuid.toString()});
        }
      )
    })
  });

  await sleep(5000);

  await adapter.stopDiscovery();

  return devices;
}


