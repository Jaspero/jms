import {NavigationItemWithActive} from '../app/shared/interfaces/navigation-item-with-active.interface';

/**
 * Configuration that is consistent across environments
 */
export const STATIC_CONFIG = {
  displayName: 'JMS',
  elements: {

    /**
     * This is removed from the components selector
     * when registering it as an element
     */
    componentPrefix: 'jms-',

    /**
     * This is added as the suffix instead
     * 
     * @example
     * A component with the selector jms-table
     * is registered as an element with the selector
     * jms-e-table
     */
    selectorPrefix: 'jms-e-',
  },
  login: {
    email: true,
    google: true,
    facebook: true
  },
  /**
   * We use this to redirect all unauthenticated users
   */
  loginRoute: ['/login'],
  /**
   * Used for redirecting all authenticated users
   * visiting pages for unauthenticated users
   */
  dashboardRoute: ['/dashboard'],
  navigation: {
    items: [
      {
        icon: 'dashboard',
        label: 'LAYOUT.DASHBOARD',
        type: 'link',
        value: '/dashboard'
      },
      {
        children: [
          {
            icon: 'supervised_user_circle',
            label: 'GENERAL.USERS',
            type: 'link',
            value: '/m/users'
          },
          {
            icon: 'vpn_key',
            label: 'GENERAL.ROLES',
            type: 'link',
            value: '/m/roles'
          }
        ],
        icon: 'account_box',
        label: 'LAYOUT.MANAGEMENT',
        type: 'expandable'
      },
      {
        children: [
          {
            icon: 'send',
            label: 'LAYOUT.INVITES',
            type: 'link',
            value: '/m/user-invites'
          }
        ],
        icon: 'dns',
        label: 'LAYOUT.SYSTEM',
        type: 'expandable'
      }
    ] as NavigationItemWithActive[]
  }
};
