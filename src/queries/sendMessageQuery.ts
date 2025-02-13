import { FileUpload, IAction } from '@/components/Bot';
import { sendRequest } from '@/utils/index';


export type IncomingInput = {
  question: string;
  uploads?: FileUpload[];
  overrideConfig?: Record<string, unknown>;
  socketIOClientId?: string;
  chatId: string;
  fileName?: string; // Only for assistant
  leadEmail?: string;
  action?: IAction;
};

export type MessageRequest = {
  chatflowid?: string;
  apiHost?: string;
  body?: IncomingInput;
};

export type FeedbackRatingType = 'THUMBS_UP' | 'THUMBS_DOWN';

export type FeedbackInput = {
  chatId: string;
  messageId: string;
  rating: FeedbackRatingType;
  content?: string;
};

export type CreateFeedbackRequest = {
  chatflowid?: string;
  apiHost?: string;
  body?: FeedbackInput;
};

export type UpdateFeedbackRequest = {
  id: string;
  apiHost?: string;
  body?: Partial<FeedbackInput>;
};

export type LeadCaptureInput = {
  chatflowid: string;
  chatId: string;
  name?: string;
  email?: string;
  phone?: string;
};

export type LeadCaptureRequest = {
  apiHost?: string;
  body: Partial<LeadCaptureInput>;
};

export const sendFeedbackQuery = ({ chatflowid, apiHost = 'http://localhost:3000', body }: CreateFeedbackRequest) =>
  sendRequest({
    method: 'POST',
    url: `${apiHost}/api/v1/feedback/${chatflowid}`,
    body,
  });

export const updateFeedbackQuery = ({ id, apiHost = 'http://localhost:3000', body }: UpdateFeedbackRequest) =>
  sendRequest({
    method: 'PUT',
    url: `${apiHost}/api/v1/feedback/${id}`,
    body,
  });

export const sendMessageQuery_flowise = ({ chatflowid, apiHost = 'http://localhost:3000', body }: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/prediction/${chatflowid}`,
    body,
  });


  export const sendMessageQuery = ({ chatflowid, apiHost, body }: MessageRequest): Promise<{ data?: any; error?: Error }> => {
    if (!apiHost) {
      throw new Error('apiHost is required');
    }
    
    if (!body) {
      throw new Error('body is required');
    }
  
    if (!body.chatId) {
      throw new Error('chatId is required');
    }
  
    // Modify chatId here
    const lastPart = body.chatId.split('-').pop() || '';
    const modifiedChatId = `id_${lastPart}`;
  
    return sendRequest({
      method: 'POST',
      url: apiHost,
      headers: {
        'X-Bot-Token': chatflowid || ''
      },
      body: {
        content: body.question || '',
        history: [], // You might need to implement history management
        type: 'text',
        from: modifiedChatId  // Use the modified chatId
      },
    });
  };

export const getChatbotConfig = ({ chatflowid, apiHost = 'http://localhost:3000' }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/public-chatbotConfig/${chatflowid}`,
  });

export const isStreamAvailableQuery = ({ chatflowid, apiHost = 'http://localhost:3000' }: MessageRequest) =>
  sendRequest<any>({
    method: 'GET',
    url: `${apiHost}/api/v1/chatflows-streaming/${chatflowid}`,
  });

export const sendFileDownloadQuery = ({ apiHost = 'http://localhost:3000', body }: MessageRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/openai-assistants-file`,
    body,
    type: 'blob',
  });

export const addLeadQuery = ({ apiHost = 'http://localhost:3000', body }: LeadCaptureRequest) =>
  sendRequest<any>({
    method: 'POST',
    url: `${apiHost}/api/v1/leads/`,
    body,
  });
