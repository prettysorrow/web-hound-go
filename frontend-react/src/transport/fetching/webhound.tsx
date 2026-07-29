import type { WebHoundRequest, WebHoundUser } from "../dtos/webhound";
import axios from "axios";

import FrontendEnvVars from "@/context/env";
const base_url = FrontendEnvVars.VITE_BACKEND_API_URL;

export async function PostWebHoundUser(user: WebHoundUser) {
  try {
    const response = await axios.post(`${base_url}/users`, user);
    return response.data;
  } catch (error) {
    console.error(`failed to post user: ${error}`);
    throw error;
  }
}

export async function GetWebHoundUsers() {
  try {
    const response = await axios.get<WebHoundUser[]>(`${base_url}/users`);
    return response.data;
  } catch (error) {
    console.error(`failed to fetch users from backend server: ${error}`);
    throw error;
  }
}

export async function GetWebHoundRequests() {
  try {
    const response = await axios.get<WebHoundRequest[]>(`${base_url}/requests`);
    return response.data;
  } catch (error) {
    console.error(`failed to fetch users from backend server: ${error}`);
    throw error;
  }
}

export async function PostWebHoundRequest(request: WebHoundRequest) {
  try {
    const response = await axios.post(`${base_url}/requests`, request);
    return response.data;
  } catch (error) {
    console.error(`failed to post request: ${error}`);
    throw error;
  }
}

export async function GetWebHoundUserRequests(user: WebHoundUser) {
  try {
    const response = await axios.get<WebHoundRequest[]>(
      `${base_url}/users/${user.used_service}/${user.service_id}/requests`,
    );
    return response.data;
  } catch (error) {
    console.error(`failed to fetch user's requests from backend server: ${error}`);
    throw error;
  }
}
