export interface Page {
  meta: {
    title: string;
    keywords?: string;
    description?: string;
  };
  blocks: any[];
}
