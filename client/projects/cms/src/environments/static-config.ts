import {Collections} from '@definitions';
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
        label: 'DASHBOARD',
        type: 'link',
        value: '/dashboard'
      },
      {
        icon: 'language',
        label: 'WEBSITE',
        type: 'expandable',
        children: [
          {
            icon: 'settings',
            label: 'LAYOUT',
            type: 'link',
            value: '/m/settings/layout'
          },
          {
            icon: 'pages',
            label: 'PAGES',
            type: 'link',
            value: '/m/pages'
          },
          {
            icon: 'rss_feed',
            label: 'BLOG',
            type: 'link',
            value: '/m/posts'
          }
        ]
      },
      {
        icon: 'language',
        label: 'SHOP',
        type: 'expandable',
        children: [
          {
            icon: 'mail',
            label: 'Orders',
            type: 'link',
            value: '/m/orders'
          },
          {
            icon: 'mail',
            label: 'Carts',
            type: 'link',
            value: '/m/carts'
          },
          {
            icon: 'settings',
            label: 'Products',
            type: 'link',
            value: '/m/products'
          },
          {
            icon: 'settings',
            label: 'Categories',
            type: 'link',
            value: '/m/product-categories'
          },
          {
            icon: 'settings',
            label: 'Tags',
            type: 'link',
            value: '/m/product-tags'
          }
        ]
      },
      {
        icon: 'mail',
        label: 'INQUIRIES',
        type: 'link',
        value: '/m/inquiries'
      },
      {
        children: [
          {
            icon: 'supervised_user_circle',
            label: 'USERS',
            type: 'link',
            value: '/m/users',
            hasPermission: Collections.Users
          },
          {
            icon: 'vpn_key',
            label: 'ROLES',
            type: 'link',
            value: '/m/roles',
            hasPermission: Collections.Roles
          },
          {
            icon: 'email',
            label: 'AUTOMATIC_EMAILS',
            type: 'link',
            value: '/m/automatic-emails',
            hasPermission: Collections.AutomaticEmails
           },
           {
             icon: 'send',
             label: 'SENT_EMAILS',
             type: 'link',
             value: '/m/sent-emails',
             hasPermission: Collections.SentEmails
           }
        ],
        icon: 'account_box',
        label: 'MANAGEMENT',
        type: 'expandable'
      },
      {
        children: [
          {
            icon: 'send',
            label: 'INVITES',
            type: 'link',
            value: '/m/user-invites',
            hasPermission: Collections.UserInvites
          }
        ],
        icon: 'dns',
        label: 'SYSTEM',
        type: 'expandable'
      }
    ] as NavigationItemWithActive[]
  }
};
