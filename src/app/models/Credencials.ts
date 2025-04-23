export interface Credencial {
  message: string;
  token: {
    type: string;
    token: string;
  };
}