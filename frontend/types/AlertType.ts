export type AlertType = AlertSuccessType | AlertErrorType | unknown;

export interface AlertSuccessType {
  success: boolean;
}

export interface AlertErrorType {
  success: boolean;
  message: any;
}
