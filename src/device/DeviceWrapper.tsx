import { useState } from 'react';

import { requestDevices } from './localDeviceService';

export default function DeviceWrapper(props) {
  const [command, setCommand] = useState('');
  return (
    <div>
      <input
        type="text"
        value={command}
        placeholder="Enter command"
        onChange={(e) => setCommand(e.target.value)}
      />
      <button onClick={() => requestDevices()}>Request Device</button>
    </div>
  );
}
