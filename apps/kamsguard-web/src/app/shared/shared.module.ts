import { NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRippleModule } from '@angular/material/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



const material = [
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatCardModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatStepperModule,
  MatTabsModule,
  MatChipsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatDialogModule,
  MatPaginatorModule,
  MatRippleModule,
  MatTreeModule,
  MatButtonToggleModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatTableModule,
  FormsModule,
  HttpClientModule,
];

const materialProviders: Provider[] = [];

const importExport = [
  CommonModule,
  ReactiveFormsModule,
  ...material
];

@NgModule({
  declarations: [],
  imports: [
    ...importExport
  ],
  exports: [
    ...importExport
  ],
  providers: [...materialProviders,
  
  ]
})
export class SharedModule { }
