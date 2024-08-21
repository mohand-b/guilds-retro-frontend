import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
  ViewChild,
  ViewContainerRef,
  WritableSignal
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {CdkPortalOutlet} from "@angular/cdk/portal";

@Component({
  selector: 'app-generic-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, CdkPortalOutlet],
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements AfterViewInit {
  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) container!: ViewContainerRef;
  public data: any = inject(MAT_DIALOG_DATA);
  buttonDisabled: WritableSignal<boolean> = signal(this.data.disableButtonUntilConditionMet);
  private childComponentRef: any;
  conditionMetEffect = effect(() => {
    if (this.data.disableButtonUntilConditionMet) {
      this.buttonDisabled.set(!this.childComponentRef.conditionMet());
    }
  }, {allowSignalWrites: true})
  private dialogRef: MatDialogRef<GenericModalComponent> = inject(MatDialogRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    if (this.data.contentComponent) {
      this.container.clear();
      const componentRef = this.container.createComponent(this.data.contentComponent, {
        injector: this.data.injector,
      });
      this.childComponentRef = componentRef.instance;

      this.cdr.detectChanges();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAction(): void {
    if (this.childComponentRef && typeof this.childComponentRef.getData === 'function') {
      const returnValue = this.childComponentRef.getData();
      this.dialogRef.close(returnValue);
    } else {
      this.dialogRef.close('OK');
    }
  }
}
