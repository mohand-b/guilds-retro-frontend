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
    button: { primary?: string; danger?: string, icon?: string },
    size: 'xs' | 'sm' | 'md' | 'xl',
    data: any,
    contentComponent?: any,
    contentText?: string,
    disableButtonUntilConditionMet: boolean = false,
    overflowYvisible: boolean = false
  ): DynamicDialogRef {
    const sizeMap = {
      xs: '30%',
      sm: '40%',
      md: '50%',
      xl: '80%',
    };

    const buttonText = button.primary || button.danger;
    const buttonColor = button.primary ? 'primary' : 'danger';
    const buttonIcon = button.icon || 'pi pi-check';


    return this.dialogService.open(GenericModalComponent, {
      header: title,
      width: sizeMap[size] || sizeMap.md,
      data: {
        buttonText,
        buttonColor,
        contentComponent,
        contentText,
        buttonIcon,
        payload: data,
        disableButtonUntilConditionMet,
        overflowYvisible,
      },
      focusOnShow: false,
      contentStyle: {'overflow-y': overflowYvisible ? 'visible' : 'hidden'},
    });
  }
}
