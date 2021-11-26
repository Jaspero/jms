export const UPLOAD_METHODS = {
  uploadMethods: [{
    id: 'file-manager',
    label: 'File Manager',
    component:
      '<jms-e-file-manager-select></jms-e-file-manager-select>',
    configuration: {
      route: '/website/assets',
      hidePath: false,
      filters: [{
        value: (file) => file.contentType.startsWith('image/')
      }],
      allowUpload: false
    }
  }]
};
