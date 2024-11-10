export type Message = {
  role: string;
  content: Array<object> | string;
};

export type ChatResponse = {
  messages: Array<Message>;
  uid: string;
  tags: Array<string>;
  masterTags: Array<string>;
  endChat: boolean;
};
