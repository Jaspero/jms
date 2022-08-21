import {EmailTemplates} from '../enums/email-templates.enum';

export const AUTOMATIC_EMAILS_COLLECTION = {
  name: 'automatic-emails',
  documents: [
		{
      id: EmailTemplates.UserSignUpInvite,
      name: 'User - Invite to Sign Up',
      recipient: 'User',
      description: 'Sent to users when they are invited to sign up.',
      subject: 'You have been invited to join JMS',
      dynamicValues: {
        link: 'link for approval',
        email: `Users email`,
				role: `Users role`
      },
      blocks: [
        {
          type: 'jms-paragraph',
          compiled: `<p>Please click on the button below to create your account.</p>`,
          value: {
            value: `<p>Please click on the button below to create your account.</p>`
          }
        },
        {
          type: 'jms-cta',
          compiled: `<a class="button" target="_blank" href="[[link]]">Sign Up</a>`,
          value: {
            link: '[[link]]',
            label: 'Sign Up'
          }
        }
      ],
      active: true
    },
	]
};
