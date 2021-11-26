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
        icon: 'inventory_2',
        label: 'Products',
        type: 'link',
        value: '/m/products'
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
          },
          {
           icon: 'email',
           label: 'MODULES.AUTOMATIC_EMAILS',
           type: 'link',
           value: '/m/automatic-emails'
          },
          {
            icon: 'send',
            label: 'MODULES.SENT_EMAILS',
            type: 'link',
            value: '/m/sent-emails'
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
