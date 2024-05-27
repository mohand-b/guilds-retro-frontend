import {MatPaginatorIntl} from "@angular/material/paginator";
import {Subject} from "rxjs";

export class CustomPaginatorComponent implements MatPaginatorIntl {
  itemsPerPageLabel = 'Éléments par page';
  nextPageLabel = 'Suivant';
  previousPageLabel = 'Précédent';
  firstPageLabel = 'Début';
  lastPageLabel = 'Fin';

  changes = new Subject<void>();

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Page 1 sur 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} sur ${amountPages}`;
  }
}
