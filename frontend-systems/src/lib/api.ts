import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.3.54:3333";

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Sheet {
  id: number;
  code: string;
  material: string;
  thickness: number;
  width: number;
  length: number;
  weight?: number;
  stock: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}