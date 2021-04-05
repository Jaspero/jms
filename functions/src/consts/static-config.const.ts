export const STATIC_CONFIG: {
  /**
   * Controls the region of each cloud function
   */
  cloudRegion: 'us-central1' | 'us-east1' | 'us-east4' | 'europe-west1' | 'europe-west2' | 'asia-east2' | 'asia-northeast1';
  /**
   * Live link for the cms
   */
  url: string;
} = {
  cloudRegion: 'us-central1',
  url: 'https://jaspero-jms.web.app/'
};
