import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteComponent } from './components/note/note.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [{ path: 'notes', component: NoteComponent,  canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
