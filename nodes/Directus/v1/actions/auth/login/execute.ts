import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { directusApiRequest } from '../../../transport';
import { helpers } from '../../../methods';

export async function login(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const parametersAreJson = this.getNodeParameter('jsonParameters', index) ?? false;

	const requestMethod = 'POST';
	const endpoint = 'auth/login';

	let body: IDataObject = {};
	if (parametersAreJson) {
		const data = this.getNodeParameter('bodyParametersJson', index) as IDataObject | string;
		body = helpers.parseData(data, 'Body Parameters');
	} else {
		body.email = this.getNodeParameter('email', index) as string;
		body.password = this.getNodeParameter('password', index) as string;
		const additionalFields = this.getNodeParameter('additionalFields', index);

		for (const key of Object.keys(additionalFields)) {
			if (['fields'].includes(key)) {
				const object = additionalFields[key] as IDataObject | string;
				body[key] = helpers.parseData(object, key);
			} else {
				body[key] = additionalFields[key];
			}
		}
	}

	const response = await directusApiRequest.call(this, requestMethod, endpoint, body);
	return this.helpers.returnJsonArray(response);
}
