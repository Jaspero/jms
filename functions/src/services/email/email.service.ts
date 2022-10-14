import sgMail from '@sendgrid/mail';
import {Collections, EMAIL_LAYOUT, EMAIL_STYLE} from 'definitions';
import {firestore} from 'firebase-admin';
import * as functions from 'firebase-functions';
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
    receiver?: string | string[],
    addedData?: any
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
      `
        <!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <style>${EMAIL_STYLE || ''}</style>
          </head>
          <body>${EMAIL_LAYOUT
        .replace(
          `<div class="main-content"></div>`,
          `<div class="main-content">${message
            .blocks
            .reduce((acc, seg) =>
              acc + seg.compiled
                .replace(/\[\[/g, '{{')
                .replace(/\]\]/g, '}}'),
              ''
            )
          }</div>`
        )
      }</body>
        </html>
      `
    );
    const html = template(context);
    const to = receiver ? receiver : message.sendTo || ENV_CONFIG.email;

    const res = await this.sendEmail({
      to,
      subject: compile(message.subject)(context),
      html,
      ...addedData || {}
    });

    let sentEmail;

    try {

      const emailDoc = firestore().collection(Collections.SentEmails).doc();

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
      functions.logger.error(e);
    }

    return sentEmail;
  }

  async sendEmail(data: Partial<sgMail.MailDataRequired>) {

    if (!this.token) {
      return 'No email token provided.';
    }

    if (!data.to) {
      functions.logger.error('No receiving email provided.');
      return 'No receiver email provided.'
    }

    if (!ENV_CONFIG.email) {
      functions.logger.error('No sender email provided.');
      return 'No sender email provided.';
    }

    try {
      await (sgMail.send as any)({
        from: ENV_CONFIG.email,
        ...data
      });
    } catch (e) {
      functions.logger.error('Failed sending email', e);
      return e.toString();
    }

    return true;
  }
}
