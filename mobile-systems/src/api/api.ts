import axios from "axios";

const MY_LOCAL_IP = '192.168.1.106';

export const api = axios.create({
  baseURL: `http://${MY_LOCAL_IP}:3000`
})

export interface Sheet {
  id: number;
  code: string;
  material: string;
  thickness: number;
  width: number;
  length: number;
  weight?: number;
  location?: string;
  createdAt: string;
  updatedAt: string;
  sheetHistories?: SheetHistory[];
}

export interface SheetHistory {
  id: number;
  alteredField: string;
  oldValue: string | null;
  newValue: string | null;
  user: string | null;
  updateDate: string;
}