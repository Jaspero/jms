import {NavigationItemWithActive} from '../app/shared/interfaces/navigation-item-with-active.interface';

/**
 * Configuration that is consistent across environments
 */
export const STATIC_CONFIG = {
  displayName: 'JMS',
  elementSelectorPrefix: 'jms-e-',
  cloudRegion: 'us-central1',
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
        icon: 'language',
        label: 'LAYOUT.WEBSITE',
        type: 'expandable',
        children: [
          {
            icon: 'settings',
            label: 'WEBSITE.LAYOUT.LAYOUT',
            type: 'link',
            value: '/m/settings/single/layout'
          },
          {
            icon: 'pages',
            label: 'MODULES.PAGES',
            type: 'link',
            value: '/m/pages'
          },
          {
            icon: 'list_alt',
            label: 'MODULES.FORMS',
            type: 'link',
            value: '/m/forms'
          },
        ]
      },
      {
        icon: 'language',
        label: 'Website HR',
        type: 'expandable',
        children: [
          {
            icon: 'settings',
            label: 'WEBSITE.LAYOUT.LAYOUT',
            type: 'link',
            value: '/m/settings-hr/single/layout'
          },
          {
            icon: 'pages',
            label: 'MODULES.PAGES',
            type: 'link',
            value: '/m/pages-hr'
          }
        ]
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
