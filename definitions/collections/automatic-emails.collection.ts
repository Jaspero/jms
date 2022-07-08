import {EmailTemplates} from '../enums/email-templates.enum';
import {PROCESSED} from '../modules/emails/processed.const';

const layout = PROCESSED.layout;
const style = PROCESSED.css;

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
      content: {
        layout,
        style,
        template: 'newsletter',
        segments: [
          {
            id: 'intro',
            content: [
							`<p>Please follow the link below to create your account</p>`,
							`<a target="_blank" href="{{link}}">{{link}}</a>`
						].join(''),
            name: 'Intro'
          },
        ]
      },
      active: true
    },
	]
};
