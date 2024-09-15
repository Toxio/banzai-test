import axios from "axios";

type SaveResponse = {
  success: boolean;
  error?: string;
}

type SaveGdprParams = {
  gdpr: boolean;
  company: {
    name: string;
    email: string;
    location: string;
  };
  sessionTime: number;
  engagement: number;
}

export const saveGdpr = async ({ gdpr, company, sessionTime, engagement }: SaveGdprParams): Promise<SaveResponse> => {
  try {
    const response = await axios.post<SaveResponse>('/manage/settings/general/save-gdpr', {
      gdpr,
      company,
      sessionTime,
      engagement,
      location: company.location,
    });

    return response.data; // Return the server response data
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.error || 'Error saving GDPR settings');
    } else if (error.request) {
      // No response received
      throw new Error('No response from server');
    } else {
      // Some other error occurred
      throw new Error(error.message);
    }
  }
};

export const savePassword = async (password: string): Promise<SaveResponse> => {
  try {
    const response = await axios.post<SaveResponse>('/manage/settings/general/save-strong-password', {
      password,
    });

    return response.data; // Return the server response data
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      throw new Error(error.response.data.error || 'Error saving password');
    } else if (error.request) {
      // No response received
      throw new Error('No response from server');
    } else {
      // Some other error occurred
      throw new Error(error.message);
    }
  }
};