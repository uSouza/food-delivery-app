import { Injectable } from '@angular/core';

@Injectable()

export class Config {
}

export const sender_id = '825111433849';
export const oneSignalAppId = '18e4fb1f-4d47-4196-8ded-4883a763d9d7';
export const client_id = 1;
export const client_secret = 'kss5gCVZ2wQyRuwf5AvfPbGbwo4AjCJ8DsXidza8'

//Production
// export const api_url = 'http://api.pandeco.com.br/';

//Test
export const api_url = 'http://localhost:8000/';

//Test
//export const api_url = 'http://api2.pandeco.com.br/';
