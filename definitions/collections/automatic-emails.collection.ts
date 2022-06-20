import {PROCESSED} from '../modules/emails/processed.const';

const layout = PROCESSED.layout;
const style = PROCESSED.css;

export const AUTOMATIC_EMAILS_COLLECTION = {
  name: 'automatic-emails',
  documents: [
    {
      id: 'inquiry-notification-admin',
      name: 'Inquiry Notification Admin',
      recipient: 'Admin',
      description: 'Sent to admins when someone fills out an inquiry request.',
      subject: 'New website inquiry',
      dynamicValues: {
        name: 'Customer\'s name',
        email: 'Customer\'s email',
        message: 'Customer\'s message',
      },
      content: {
        layout,
        style,
        template: 'newsletter',
        segments: [
          {
            id: 'intro',
            content:
              '<h1>Dear admin,</h1>\n<p>Someone just reached out from the website.</p>',
            name: 'Intro'
          },
          {
            content:
              [
								'<p>Name: <b>{{name}}</b></p>',
								'<p>Email: <b>{{email}}</b></p>',
								'<p>Message: <b>{{message}}</b></p>',
							].join('\n'),
            name: 'Section',
            id: 'section'
          },
        ]
      },
      active: true
    },
	]
};
