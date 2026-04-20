export interface IApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}
