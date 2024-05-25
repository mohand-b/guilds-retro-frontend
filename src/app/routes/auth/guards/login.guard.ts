import {AuthenticatedFacade} from "../../authenticated/authenticated.facade";
import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";

export const loginGuard: CanActivateFn = () => {
  const authenticatedFacade = inject(AuthenticatedFacade);
  const router = inject(Router);
  if (!authenticatedFacade.token$()) {
    return true;
  }
  return router.parseUrl('/');
};
