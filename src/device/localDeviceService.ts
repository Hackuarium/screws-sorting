import { DevicesManager } from 'legoino-navigator-serial';

const SCAN_INTERVAL = 1000;

//@ts-expect-error it exists in the browser on chrome
const devicesManager = new DevicesManager(navigator.serial);

/**
 * return device information to be stored in DB
 */
export const localDeviceInfo = ({ id, name }) => {
  return {
    _id: `${name}-${id}`,
    id,
    name: name ?? id,
  };
};

/**
 * By calling this method from a click you give users the possibility to allow access to some devices
 */
export const requestDevices = async () => {
  await devicesManager.requestDevices();
};

/**
 * @returns {Array<object>}
 */
export const getConnectedDevices = async () => {
  await devicesManager.updateDevices();
  const connectedDevices = await devicesManager.getDevicesList({
    ready: true, // If ready==`true` returns only currently connected device, else returns all devices ever connected.
  });
  return connectedDevices;
};

/**
 * Update updated devices list every `scanInterval` [ms].
 * @param {Function} callback(devicesList): Callback to execute on each update
 * @param {number} scanInterval Delay between calls
 */
export const continuousUpdateDevices = async (
  callback,
  scanInterval = SCAN_INTERVAL,
) => {
  const interval = setInterval(async () => {
    const connectedDevices = await getConnectedDevices();
    callback(connectedDevices);
  }, scanInterval);
  return interval;
};

/**
 * Send a serial command to a device.
 * @param {number} id ID of the device
 * @param {string} command Command to send
 * @returns ??????
 */
export const sendCommand = async (deviceId, command) => {
  return devicesManager.sendCommand(deviceId, command);
};
