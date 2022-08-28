
## Disclaimer:

### This program is in active development and is not yet in working order.

## Requirements:

this program makes use of the [node-ble](https://www.npmjs.com/package/node-ble) package to establish a bluetooth connection with the desk.

### Linux:

Maybe you need to install Bluez to use this package, haven't tested it.

#### The following if from the [node-ble](https://www.npmjs.com/package/node-ble) documentation:

In order to allow a connection with the DBus daemon, you have to set up right permissions.

Create the file /etc/dbus-1/system.d/node-ble.conf with the following content (customize with userid)

```
<!DOCTYPE busconfig PUBLIC "-//freedesktop//DTD D-BUS Bus Configuration 1.0//EN"
  "http://www.freedesktop.org/standards/dbus/1.0/busconfig.dtd">
<busconfig>
  <policy user="%userid%">
   <allow own="org.bluez"/>
    <allow send_destination="org.bluez"/>
    <allow send_interface="org.bluez.GattCharacteristic1"/>
    <allow send_interface="org.bluez.GattDescriptor1"/>
    <allow send_interface="org.freedesktop.DBus.ObjectManager"/>
    <allow send_interface="org.freedesktop.DBus.Properties"/>
  </policy>
</busconfig>
```

## Usage:

- First run `npm install` to install all dependencies. 
- To run the program use: `node bin/deskCLI.js --help`. 
- You will first need to select the bluetooth desk with `node bin/deskCLI.js connect`.
- Then select your preferred standing and sitting height with `node bin/deskCLI.js configure`.

Now to move the desk use one of the three following commands:

- `node bin/deskCLI.js sit`: Move the desk to the preferred sitting height.
- `node bin/deskCLI.js stand`: Move the desk to the preferred standing height.
- `node bin/deskCLI.js move <height in cm>`: Move the desk to the provided height.
