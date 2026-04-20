export type HttpErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 500;

export interface IAppError {
  status: HttpErrorStatus;
  message: string;
  field?: string;
}
