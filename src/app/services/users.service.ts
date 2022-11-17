import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type User = {
  id: number;
  name: string;
  username: string;
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  users$ = this.http.get<User[]>(`https://jsonplaceholder.typicode.com/users`);
}
