import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Injector,
  ViewChild,
  ViewContainerRef
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
  styleUrl: './generic-modal.component.scss'
})
export class GenericModalComponent implements AfterViewInit {
  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) container!: ViewContainerRef;
  public data: any = inject(MAT_DIALOG_DATA);
  buttonDisabled: boolean = this.data.disableButtonUntilConditionMet;
  private childComponentRef: any;
  private dialogRef: MatDialogRef<GenericModalComponent> = inject(MatDialogRef);
  private injector: Injector = inject(Injector);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    this.container.clear();
    const componentRef = this.container.createComponent(this.data.childComponent, {
      injector: this.data.injector,
    });
    this.childComponentRef = componentRef.instance;

    if (this.data.disableButtonUntilConditionMet) {
      if (this.childComponentRef.conditionMet$) {
        this.childComponentRef.conditionMet$.subscribe(() => {
          this.buttonDisabled = false;
          this.cdr.detectChanges();
        });
      }
    }
    this.cdr.detectChanges();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAction(): void {
    if (this.childComponentRef && typeof this.childComponentRef.getData === 'function') {
      const returnValue = this.childComponentRef.getData();
      this.dialogRef.close(returnValue);
    } else {
      this.dialogRef.close();
    }
  }
}
