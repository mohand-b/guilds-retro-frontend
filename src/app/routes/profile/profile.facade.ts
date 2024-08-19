import {inject, Injectable} from "@angular/core";
import {UsersService} from "./state/users/users.service";
import {Observable} from "rxjs";
import {UserDto} from "../authenticated/state/authed/authed.model";

@Injectable({providedIn: 'root'})
export class ProfileFacade {

  private usersService = inject(UsersService);

  getUserByUsername(username: string): Observable<UserDto> {
    return this.usersService.getUserByUsername(username);
  }
}
