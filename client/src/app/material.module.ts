import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatBadgeModule } from '@angular/material/badge'
import { MatInputModule } from '@angular/material/input'

@NgModule({
  imports: [
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatInputModule,
  ],
  exports: [
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatInputModule,
  ]
})
export class MaterialModule {}