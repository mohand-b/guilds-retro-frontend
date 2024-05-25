import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {inject, Signal} from "@angular/core";
import {roleHierarchy, UserDto, UserRoleEnum} from "../state/authed/authed.model";
import {AuthenticatedFacade} from "../authenticated.facade";

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const authenticatedFacade: AuthenticatedFacade = inject(AuthenticatedFacade);
  const router: Router = inject(Router);

  const requiredRole: UserRoleEnum = route.data['role'];
  const user: Signal<UserDto | undefined> = authenticatedFacade.currentUser$;

  if (!user || !hasRequiredRole(user()!.role, requiredRole)) {
    return router.parseUrl('/dashboard');
  }

  return true;
};

export const hasRequiredRole = (userRole: UserRoleEnum, requiredRole: UserRoleEnum): boolean => {
  if (userRole === requiredRole) {
    return true;
  }

  return roleHierarchy[userRole].includes(requiredRole);
};
