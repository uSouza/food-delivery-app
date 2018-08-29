import { Client } from "./client";

export class UserPandeco {
  id: number;
  name: string;
  type: string = "client";
  email: string;
  password: string;
  token: string;
  client: Client;
}
