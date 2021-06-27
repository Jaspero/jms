import {NavigationItemWithActive} from '../app/shared/interfaces/navigation-item-with-active.interface';

/**
 * Configuration that is consistent across environments
 */
export const STATIC_CONFIG = {
  displayName: 'JMS',
  elementSelectorPrefix: 'jms-e-',
  navigation: {
    items: [
      {
        icon: 'dashboard',
        label: 'LAYOUT.DASHBOARD',
        type: 'link',
        value: '/dashboard'
      },
      {
        icon: 'list_alt',
        label: 'MODULES.FORMS',
        type: 'link',
        value: '/m/forms'
      },
      {
        icon: 'pages',
        label: 'MODULES.PAGES',
        type: 'link',
        value: '/m/pages'
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
