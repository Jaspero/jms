export const SETTINGS_COLLECTION = {
  name: 'settings',
  documents: [
    {
      id: 'layout',
      navigation: {
        items: [
          {
            icon: 'dashboard',
            label: 'LAYOUT.DASHBOARD',
            type: 'link',
            value: '/dashboard'
          },
          {
            icon: '',
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
                icon: 'view_module',
                label: 'LAYOUT.MODULES',
                type: 'link',
                value: '/module-definition/overview'
              },
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
        ]
      }
    }
  ]
};
