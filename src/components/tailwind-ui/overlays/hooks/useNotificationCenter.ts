import { useContext } from 'react';

import {
  notificationContext,
  NotificationContext,
} from '../NotificationContext';

export function useNotificationCenter(): NotificationContext {
  const context = useContext(notificationContext);

  if (context === null) {
    throw new Error('Missing notification context');
  }

  return context;
}
