import {SHARED_CONFIG, Collections} from 'definitions';
import * as functions from 'firebase-functions';
import {EmailService} from '../services/email/email.service';

export const inquiryCreated = functions
	.region(SHARED_CONFIG.cloudRegion)
	.firestore
	.document(`${Collections.Inquiries}/{documentId}`)
	.onCreate(async snap => {
		const data = snap.data() as any;
    const email = new EmailService();

		await email.parseEmail('inquiry-notification-admin', data, SHARED_CONFIG.adminEmail);
	});