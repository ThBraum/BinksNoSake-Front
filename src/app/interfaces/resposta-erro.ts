export interface RespostaErro {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  errors?: string[];
}
