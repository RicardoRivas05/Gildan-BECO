import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ClientsComponent } from "./components/clients/clients.component";
import { ProvidersComponent } from "./components/providers/providers.component";
import { ZonesComponent } from "./components/zones/zones.component";
import { MetersComponent } from "./components/meters/meters.component";
import { RatesComponent } from './components/rates/rates.component';
import { InputParametersComponent } from './components/input-parameters/input-parameters.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { EnergyMatrixComponent } from './components/energy-matrix/energy-matrix.component';
import { EspecialChargesComponent } from './components/especial-charges/especial-charges.component';
import { GeneratedInvoicesComponent } from './components/generated-invoices/generated-invoices.component';
import { IssuedInvoicesComponent } from './components/issued-invoices/issued-invoices.component';
import { CancelledInvoicesComponent } from './components/cancelled-invoices/cancelled-invoices.component';
import { ReportComponent } from './components/report/report.component';
import { UsersComponent } from './components/users/users.component';


const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children:
     [
      {
        path: 'welcome',
        component: HomeComponent
      },
      {
        path: 'clients',
        component: ClientsComponent
      },
      {
        path: 'providers',
        component: ProvidersComponent
      },
      {
        path: 'zones',
        component: ZonesComponent
      },
      {
        path: 'meters',
        component: MetersComponent
      },
      {
        path: 'rates',
        component: RatesComponent
      },
      {
        path: 'input-parameters',
        component: InputParametersComponent
      },
      {
        path: 'contracts',
        component: ContractsComponent
      },
      {
        path: 'energy-matrix',
        component: EnergyMatrixComponent
      },
      {
        path: 'especial-charges',
        component: EspecialChargesComponent
      },
      {
        path: 'generated-invoices',
        component: GeneratedInvoicesComponent
      },
      {
        path: 'issued-invoices',
        component: IssuedInvoicesComponent
      },
      {
        path: 'cancelled-invoices',
        component: CancelledInvoicesComponent
      },
      {
        path: 'report',
        component: ReportComponent
      },
      {
        path: 'users',
        component: UsersComponent
      }
     ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuLayoutRoutingModule { }
