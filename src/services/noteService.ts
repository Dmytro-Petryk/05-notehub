import axios from "axios";
import { type Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchNotes = async (
  page: number,
  search: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const response = await axiosInstance.get<{
    notes: Note[];
    totalPages: number;
  }>("/notes", {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
    },
  });
  return response.data;
};

type NewNotePayload = {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
};

export const createNote = async (note: NewNotePayload): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/notes", note);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
};
