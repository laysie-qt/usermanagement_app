import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'https://reqres.in/api/users'

  constructor(private http: HttpClient) { }

  getUserPerPage(page: number = 1, perPage: number = 6): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get(this.apiUrl, { params });
  }
  getListOfUsers(page1: number = 1, page2: number = 2, perPage: number = 6): Observable<any[]> {
    return new Observable(observer => {
      let users: any[] = [];

      this.getUserPerPage(page1, perPage).subscribe({
        next: (responsePage1) => {
          users = [...users, ...responsePage1.data];

          this.getUserPerPage(page2, perPage).subscribe({
            next: (responsePage2) => {
              users = [...users, ...responsePage2.data];

              observer.next(users);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  updateUser(userId: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
}
