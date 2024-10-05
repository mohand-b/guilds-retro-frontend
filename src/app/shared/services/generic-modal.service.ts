import {inject, Injectable} from '@angular/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {GenericModalComponent} from "../components/generic-modal/generic-modal.component";

@Injectable({
  providedIn: 'root',
})
export class GenericModalService {

  private dialogService = inject(DialogService);

  open(
    title: string,
    button: { primary?: string; danger?: string },
    size: 'xs' | 'sm' | 'md' | 'xl',
    data: any,
    contentComponent?: any,
    contentText?: string,
    disableButtonUntilConditionMet: boolean = false // Nouvelle option pour conditionner le bouton
  ): DynamicDialogRef {
    const sizeMap = {
      xs: '30%',
      sm: '40%',
      md: '50%',
      xl: '80%',
    };

    const buttonText = button.primary || button.danger;
    const buttonColor = button.primary ? 'primary' : 'danger';

    return this.dialogService.open(GenericModalComponent, {
      header: title,
      width: sizeMap[size] || sizeMap.md,
      data: {
        buttonText,
        buttonColor,
        contentComponent,
        contentText,
        payload: data,
        disableButtonUntilConditionMet,
      },
      closable: false,
      focusOnShow: false,
    });
  }
}
