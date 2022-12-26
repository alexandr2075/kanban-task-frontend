import axios from 'axios';
import { LoginResponse, UserData } from '~/types/api';
import { ENDPOINT_URL } from '~/utils/constants';

export const _signIn = async (login: string, password: string) => {
  console.log(login, password);
  const response = await axios.post<LoginResponse>(`${ENDPOINT_URL}/auth/signin`, {
    login,
    password,
  });
  return response.data;
};

export const _signUp = async (name: string, login: string, password: string) => {
  console.log(name, login, password);
  console.log(ENDPOINT_URL);

  const response = await axios.post<UserData>(`${ENDPOINT_URL}/auth/signup`, {
    name,
    login,
    password,
  });
  console.log(response);

  return response.data;
};
