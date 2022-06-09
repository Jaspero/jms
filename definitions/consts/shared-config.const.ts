export const SHARED_CONFIG: {
	projectId: string,
	github: {
		organization: string,
		repository: string,
	},
  cloudRegion: 'us-central1' | 'us-east1' | 'us-east4' | 'europe-west1' | 'europe-west2' | 'asia-east2' | 'asia-northeast1';
	webUrl: string;
} = {
	github: {
		organization: 'Jaspero',
		repository: 'jms',
	},
	projectId: 'jaspero-jms',
	cloudRegion: 'us-central1',
	webUrl: 'https://jaspero-jms.web.app',
};