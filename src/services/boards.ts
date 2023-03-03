import axios, { AxiosError } from 'axios';
import { ENDPOINT_URL } from '~/utils/constants';
import { getToken } from '~/utils/getToken';
import { BoardData } from '~/types/api';

export const getAllBoards = async () => {
  try {
    const response = await axios.get<BoardData[]>(`${ENDPOINT_URL}/boards`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (e) {
    if (e instanceof Error) {
      const error = e as AxiosError;
      return error.response;
    }
  }
};

export const createBoard = async (title: string, owner: string, users: string[]) => {
  try {
    const response = await axios.post<BoardData>(
      `${ENDPOINT_URL}/boards`,
      {
        title,
        owner,
        users,
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      },
    );
    return response.data;
  } catch (e) {
    if (e instanceof Error) {
      const error = e as AxiosError;
      return error.response;
    }
  }
};

export const getAllUserBoards = async (userId: string) => {
  try {
    const response = await axios.get<BoardData[]>(`${ENDPOINT_URL}/boardsSet/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (e) {
    if (e instanceof Error) {
      const error = e as AxiosError;
      return error.response;
    }
  }

};

export const getBoard = async (id: string) => {
  try {
    const response = await axios.get<BoardData>(`${ENDPOINT_URL}/boards/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (e) {
    if (e instanceof Error) {
      const error = e as AxiosError;
      return error.response;
    }
  }
};

export const deleteBoard = async (id: string) => {
  try {
    const response = await axios.delete<null>(`${ENDPOINT_URL}/boards/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response;
  } catch (e) {
    if (e instanceof Error) {
      const error = e as AxiosError;
      return error.response;
    }
  }
};

export const updateBoard = async (id: string, title: string, description: string) => {
  try {
    const response = await axios.put<BoardData>(
      `${ENDPOINT_URL}/boards/${id}`,
      {
        title,
        owner: 'alex',
        users: [],
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      },
    );
    return response.data;
  } catch (e) {
    if (e instanceof Error) {
      const error = e as AxiosError;
      return error.response;
    }
  }
};
