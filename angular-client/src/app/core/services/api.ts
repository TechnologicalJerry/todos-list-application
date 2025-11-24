import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5050';

  get<T>(endpoint: string, params?: HttpParams | Record<string, string | number | boolean>): Observable<T> {
    const httpParams = params instanceof HttpParams ? params : this.createHttpParams(params);
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  post<T>(endpoint: string, body?: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  put<T>(endpoint: string, body?: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  patch<T>(endpoint: string, body?: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  delete<T>(endpoint: string, params?: HttpParams | Record<string, string | number | boolean>): Observable<T> {
    const httpParams = params instanceof HttpParams ? params : this.createHttpParams(params);
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { params: httpParams });
  }

  private createHttpParams(params?: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return httpParams;
  }
}
