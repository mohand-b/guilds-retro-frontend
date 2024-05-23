import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {inject, Injectable, Injector} from "@angular/core";
import {GenericModalComponent} from "../components/generic-modal/generic-modal.component";

@Injectable({
  providedIn: 'root'
})
export class GenericModalService {

  private dialog: MatDialog = inject(MatDialog);
  private injector: Injector = inject(Injector);

  open(
    title: string,
    childComponent: any,
    button: { primary?: string, warn?: string },
    size: 'xs' | 'sm' | 'md' | 'xl',
    data: any,
    disableButtonUntilConditionMet: boolean = false,
  ) {
    const sizeMap = {
      xs: '300px',
      sm: '400px',
      md: '500px',
      xl: '800px'
    };

    const buttonText: string | undefined = button.primary || button.warn;
    const buttonColor: 'primary' | 'warn' = button.primary ? 'primary' : 'warn';

    return this.dialog.open(GenericModalComponent, {
      width: sizeMap[size] || sizeMap.md,
      data: {
        title,
        childComponent,
        buttonText,
        buttonColor,
        injector: Injector.create({
          providers: [
            {provide: MAT_DIALOG_DATA, useValue: data},
          ],
          parent: this.injector,
        }),
        disableButtonUntilConditionMet,
      },
      autoFocus: false,
    }).afterClosed();
  }

}
