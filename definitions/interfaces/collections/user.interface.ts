export interface User {
  id?: string;
  name?: string;
  email: string;
  role: string;
  providerData: any;
  requireReset?: boolean;
  invitedBy?: string;
}

