import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {inject, Signal} from "@angular/core";
import {AppRankEnum, rankHierarchy} from "../state/authed/authed.model";
import {AuthenticatedFacade} from "../authenticated.facade";
import {UserDto} from "../../profile/state/users/user.model";

export const rankGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const authenticatedFacade: AuthenticatedFacade = inject(AuthenticatedFacade);
  const router: Router = inject(Router);

  const requiredRank: AppRankEnum = route.data['appRank'];
  const user: Signal<UserDto | undefined> = authenticatedFacade.currentUser;

  if (!user()) {
    return router.parseUrl('/auth/login');
  } else if (!hasRequiredRank(user()!.appRank, requiredRank)) {
    return router.parseUrl('/dashboard');
  }

  return true;
};

export const hasRequiredRank = (userRank: AppRankEnum, requiredRank: AppRankEnum): boolean => {
  if (userRank === requiredRank) {
    return true;
  }

  return rankHierarchy[userRank].includes(requiredRank);
};

