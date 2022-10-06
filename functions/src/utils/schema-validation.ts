import Ajv from 'ajv';
import * as functions from 'firebase-functions';
import {JSONSchema7} from 'json-schema';

export function schemaValidation(
	data: any,
	schema: JSONSchema7,
	message = `Data format invalid.`
) {
	const ajv = new Ajv();
	const validate = ajv.compile(schema);
	const valid = validate(data);

	if (!valid) {
		throw new functions.https.HttpsError('failed-precondition', message);
	}
}