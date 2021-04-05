export interface EmailTemplate {
  active: boolean;
  description: string;
  dynamicValues: any;
  name: string;
  recipient: string;
  content: {
    template: string;
    segments: Array<{
      id: string;
      name: string;
      content: string;
    }>;
    layout: string;
    style?: string;
  };
  subject: string;
  sendTo: string;
}
