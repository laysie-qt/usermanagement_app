import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private apiUrl = 'https://reqres.in/api/resources'

  constructor(private http: HttpClient) { }

  getResourcePerPage(page: number = 1, perPage: number = 6): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());
    return this.http.get(this.apiUrl, { params });
  }
  getListOfResources(page1: number = 1, page2: number = 2, perPage: number = 6): Observable<any[]> {
    return new Observable(observer => {
      let resources: any[] = [];

      this.getResourcePerPage(page1, perPage).subscribe({
        next: (responsePage1) => {
          resources = [...resources, ...responsePage1.data];

          this.getResourcePerPage(page2, perPage).subscribe({
            next: (responsePage2) => {
              resources = [...resources, ...responsePage2.data];

              observer.next(resources);
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

  createResources(resources: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, resources);
  }

  updateResources(resourcesId: number, resources: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${resourcesId}`, resources);
  }

  deleteResources(resourcesId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${resourcesId}`);
  }
}
