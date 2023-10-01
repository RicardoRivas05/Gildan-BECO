import { eneeComponent } from './components/enee/enee.component';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ClientsComponent } from "./components/clients/clients.component";
import { ProvidersComponent } from "./components/providers/providers.component";
import { ZonesComponent } from "./components/zones/zones.component";
import { cpiComponent } from './components/cpi/cpi.component';
import { ipcComponent } from './components/ipc/ipc.component';
import { euroComponent } from './components/euro/euro.component';
import { dollarComponent } from './components/dollar/dollar.component';
import { horasPuntaComponent } from './components/horasPunta/horasPunta.component';
import { variablesContratoComponent } from './components/contratos/contratocomponent';
import { combustibleComponent } from './components/combustible/combustible.component';
import { MetersComponent } from "./components/meters/meters.component";
import { RatesComponent } from './components/rates/rates.component';
import { InputParametersComponent } from './components/input-parameters/input-parameters.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { EnergyMatrixComponent } from './components/energy-matrix/energy-matrix.component';
import { EspecialChargesComponent } from './components/especial-charges/especial-charges.component';
import { ReportComponent } from './components/report/report.component';
import { UsersComponent } from './components/users/users.component';
import { ReportsComponent } from './components/reports/reports.component';
import { feriadosHnComponent } from './components/feriadosHn/feriadosHn.component';


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
        path: 'cpi',
        component: cpiComponent
      },
      {
        path: 'ipc',
        component: ipcComponent
      },
      {
        path: 'euro',
        component: euroComponent
      },
      {
        path: 'dollar',
        component: dollarComponent
      },
      {
        path: 'horasPunta',
        component: horasPuntaComponent
      },
      {
        path: 'variablesContrato',
        component: variablesContratoComponent
      },

      {
        path: 'feriadosHn',
        component: feriadosHnComponent
      },
      {
        path: 'combustible',
        component: combustibleComponent
      },
      {
        path: 'lecturasEnee',
        component: eneeComponent
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
        path: 'report',
        component: ReportComponent
      },

      {
        path: 'reports',
        component: ReportsComponent
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
