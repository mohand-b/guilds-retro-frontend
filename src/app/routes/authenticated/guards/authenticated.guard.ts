import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthenticatedFacade} from "../authenticated.facade";

export const authenticatedGuard: CanActivateFn = () => {
  const authenticatedFacade = inject(AuthenticatedFacade);
  const router = inject(Router);
  if (!!authenticatedFacade.token$()) {
    return true;
  }
  return router.parseUrl('/auth/login');
};
