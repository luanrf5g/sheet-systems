import axios from "axios";

export const api = axios.create({
  baseURL: `http://${process.env.EXPO_PUBLIC_MY_LOCAL_IP}:3333`
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