import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User|null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream: () => this.checkStatus()
  });

  authStatus = computed<AuthStatus>(() => {
    if(this._authStatus() == 'checking') return 'checking';

    if(this._user()) return 'authenticated';

    return 'not-authenticated';
  });

  user = computed<User|null>(() => {
    return this._user();
  });

  token = computed<string|null>(() => {
    return this._token();
  });

  isAdmin = computed<boolean|null>(() => {
    if(this._user() == null) return false;
    return this._user()!.roles.includes('admin') ?? false;
  });


  login(email: string, password: string): Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.hanldeAuthError(error))
    );
  }

  register(email: string, password: string, fullName: string) {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, {
      email,
      password,
      fullName
    }).pipe(
      map(resp => true),
      catchError((error: any) => of(false))
    );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }


    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`, {
    }).pipe(
      map(resp => this.handleAuthSuccess(resp)),
      catchError((error: any) => this.hanldeAuthError(error))
    )

  }

  logout(){
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({user, token}: AuthResponse) {
    console.log('Autenticación exitosa', {user, token});
    this._authStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token);
    return true;
  }

  private hanldeAuthError(error: any) {
    console.log('Error en la autenticación', error);
    this.logout();
    return of(false);
  }






}
