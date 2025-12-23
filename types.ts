
export interface DetectedObject {
  id: string;
  name: string;
  brand: string;
  confidence: number;
  boundingBox: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export enum AuthView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  DASHBOARD = 'DASHBOARD'
}
