import {inject, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {AuthedStateDto} from "../../../authenticated/state/authed/authed.model";
import {LoginDto, RegisterMemberDto} from "./auth.model";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);

  private readonly authBaseUrl = `${environment.apiUrl}/auth`;

  login(loginDto: LoginDto): Observable<AuthedStateDto> {
    return this.http.post<AuthedStateDto>(
      `${this.authBaseUrl}/login`,
      loginDto,
    );
  }

  registerAsMember(registerMemberDto: RegisterMemberDto): Observable<AuthedStateDto> {
    return this.http.post<AuthedStateDto>(
      `${this.authBaseUrl}/register-member`,
      registerMemberDto,
    );
  }

  registerAsLeader(registerLeaderFormData: FormData): Observable<AuthedStateDto> {
    return this.http.post<AuthedStateDto>(
      `${this.authBaseUrl}/register-leader`,
      registerLeaderFormData,
    );
  }


}
