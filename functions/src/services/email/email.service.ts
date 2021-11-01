import * as sgMail from '@sendgrid/mail';
import {firestore} from 'firebase-admin';
import {compile} from 'handlebars';
import {ENV_CONFIG} from '../../consts/env-config.const';
import {EmailTemplate} from './email-template.interface';

/**
 * SendGrid docs
 * https://sendgrid.com/docs/api-reference/
 */
export class EmailService {
  token: string | undefined;

  constructor() {
    if (ENV_CONFIG.sendgrid && ENV_CONFIG.sendgrid.key) {
      this.token = ENV_CONFIG.sendgrid.key;
      sgMail.setApiKey(ENV_CONFIG.sendgrid.key);
    }
  }

  async parseEmail(
    templateId: string,
    context?: any,
    receiver?: string | string[]
  ) {

    const fs = firestore();

    const messageSnap = await fs
      .doc(`automatic-emails/${templateId}`)
      .get();
    const message: EmailTemplate = messageSnap.data() as any;

    if (!message.active) {
      return;
    }

    const template = compile(
      (message.content.style ? `<style>${message.content.style}</style>` : '') +
      message.content.layout
        .replace(
          `<div class="main-content"></div>`,
          `<div class="main-content">${message.content.segments.reduce((acc, seg) => acc + seg.content, '')}</div>`
        )
    );
    const html = template(context);
    const to = receiver ? receiver : message.sendTo || ENV_CONFIG.email;

    const res = await this.sendEmail({
      to,
      subject: message.subject,
      html
    });

    let sentEmail;

    try {

      const emailDoc = firestore().collection('sent-emails').doc();

      await emailDoc.create({
        createdOn: Date.now(),
        to,
        html,
        subject: message.subject,
        templateId,
        ...res === true ? {status: true} : {status: false, error: res}
      });

      sentEmail = emailDoc.id
    } catch (e) {
      console.error(e);
    }

    return sentEmail;
  }

  async sendEmail(data: Partial<sgMail.MailDataRequired>) {

    if (!this.token) {
      return 'No email token provided.';
    }

    if (!data.to) {
      console.error('No receiving email provided.');
      return 'No receiver email provided.'
    }

    if (!ENV_CONFIG.email) {
      console.error('No sender email provided.');
      return 'No sender email provided.';
    }

    try {
      await (sgMail.send as any)({
        from: ENV_CONFIG.email,
        ...data
      });
    } catch (e) {
      console.error('Failed sending email', e.toString());
      return e.toString();
    }

    return true;
  }
}
