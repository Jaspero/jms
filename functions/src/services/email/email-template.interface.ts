export interface EmailTemplate {
  active: boolean;
  description: string;
  dynamicValues: any;
  name: string;
  recipient: string;
  blocks: Array<{
    compiled: string;
    type: string;
    value: any;
  }>;
  subject: string;
  sendTo: string;
}
