
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { NewMomentComponent } from './components/pages/new-moment/new-moment.component';
import { NgModule } from '@angular/core';
import { MomentComponent } from './components/pages/moment/moment.component';
import { EditMomentComponent } from './components/pages/edit-moment/edit-moment.component';
import { AccessComponent } from './components/pages/access/access.component';
import { RegisterComponent } from './components/pages/register/register.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'enter', component: AccessComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'moments/new', component: NewMomentComponent },
    { path: 'moments/edit/:id', component: EditMomentComponent },
    { path: 'moments/:id', component: MomentComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
