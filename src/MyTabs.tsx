import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { ObjectInspector } from 'react-inspector';

import ImageViewerWrapper from './ImageViewerWrapper';
import ExploreGreyWrapper from './components/explore/ExploreGreyWrapper';
import ExploreMaskWrapper from './components/explore/ExploreMaskWrapper';
import ExploreROIsWrapper from './components/explore/ExploreROIsWrapper';

export default function MyTabs() {
  const tabs = ['Image', 'Grey', 'Mask', 'ROIs'];

  return (
    <Tab.Group>
      <Tab.List>
        {tabs.map((tab) => {
          return (
            <Tab as={Fragment}>
              {({ selected }) => (
                /* Use the `selected` state to conditionally style the selected tab. */
                <button
                  className={
                    selected ? 'bg-blue-500 text-white' : 'bg-white text-black'
                  }
                >
                  {tab}
                </button>
              )}
            </Tab>
          );
        })}
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <ImageViewerWrapper />
        </Tab.Panel>
        <Tab.Panel>
          <ExploreGreyWrapper />
        </Tab.Panel>
        <Tab.Panel>
          <ExploreMaskWrapper />
        </Tab.Panel>
        <Tab.Panel>
          <ExploreROIsWrapper />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}