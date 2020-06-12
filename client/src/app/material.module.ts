import { NgModule } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatBadgeModule } from '@angular/material/badge'

@NgModule({
  imports: [
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatBadgeModule,    
  ],
  exports: [
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatBadgeModule,
  ]
})
export class MaterialModule {}