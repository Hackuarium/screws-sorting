import {
  CommandLineIcon,
  EyeIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

import ImageViewerWrapper from './ImageViewerWrapper';
import WebcamWrapper from './WebcamWrapper';
import ObjectInspectorWrapper from './components/debug/ObjectInspectorWrapper';
import ExploreGreyWrapper from './components/explore/ExploreGreyWrapper';
import ExploreMaskWrapper from './components/explore/ExploreMaskWrapper';
import ExploreROIsWrapper from './components/explore/ExploreROIsWrapper';
import { SwitchTabs, SwitchTabsItems } from './components/tailwind-ui';
import DeviceWrapper from './device/DeviceWrapper';

export default function MyTabs() {
  const tabs: Array<SwitchTabsItems> = [
    {
      title: 'Image viewer',
      content: <ImageViewerWrapper />,
    },

    {
      title: 'Explore grey',
      content: <ExploreGreyWrapper />,
    },
    {
      title: 'Explore mask',
      content: <ExploreMaskWrapper />,
    },
    {
      title: 'Explore ROIs',
      content: <ExploreROIsWrapper />,
    },
    {
      title: 'Webcam',
      content: <WebcamWrapper />,
    },
    {
      title: 'Device',
      content: <DeviceWrapper />,
    },
    {
      title: 'Object inspector',
      content: <ObjectInspectorWrapper />,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-200">
      <SwitchTabs tabs={tabs} align="center" />
    </div>
  );
}
