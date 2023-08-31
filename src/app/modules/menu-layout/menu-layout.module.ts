import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuLayoutRoutingModule } from './menu-layout-routing.module';
import { HomeComponent } from './components/home/home.component';

//layout
import { IconsProviderModule } from '../../icons-provider.module';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';


import { SharedModule } from "@shared/shared.module";
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { ZonesComponent } from './components/zones/zones.component';
import { cpiComponent } from './components/cpi/cpi.component';
import { ipcComponent } from './components/ipc/ipc.component';
import { euroComponent} from './components/euro/euro.component';
import { dollarComponent } from './components/dollar/dollar.component';
import { horasPuntaComponent } from './components/horasPunta/horasPunta.component';
import { combustibleComponent } from './components/combustible/combustible.component';
import { MetersComponent } from './components/meters/meters.component';
import { MetersModalComponent } from "./components/meters/meters-modal/meters-modal.component";
import { VirtualMeterModalComponent } from "./components/meters/virtual-meter-modal/virtual-meter-modal.component";

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatesComponent } from './components/rates/rates.component';
import { InputParametersComponent } from './components/input-parameters/input-parameters.component';
import { ContractsComponent } from './components/contracts/contracts.component';
import { EnergyMatrixComponent } from './components/energy-matrix/energy-matrix.component';
import { EspecialChargesComponent } from './components/especial-charges/especial-charges.component';
import { ModalParametersComponent } from './components/rates/modal-parameters/modal-parameters.component';
import { ModalMedidoresComponent } from './components/contracts/modal-medidores/modal-medidores.component';
import { ModalNewContractComponent } from './components/contracts/modal-new-contract/modal-new-contract.component';
import { ModalNewParameterComponent } from './components/input-parameters/modal-new-parameter/modal-new-parameter.component';
import { ModalNewChargeComponent } from './components/especial-charges/modal-new-charge/modal-new-charge.component';
import { ModalNewMatrixComponent } from './components/energy-matrix/modal-new-matrix/modal-new-matrix.component';
import { ModalDistributionComponent } from './components/energy-matrix/modal-distribution/modal-distribution.component';
import { ModalNewRateComponent } from './components/rates/modal-new-rate/modal-new-rate.component';
import { ReportComponent } from './components/report/report.component';
import { RollOverModalComponent } from './components/meters/roll-over-modal/roll-over-modal.component';
import { SubmitZoneModalComponent } from './components/zones/submit-zone-modal/submit-zone-modal.component';
import { SubmitcpiModalComponent } from './components/cpi/submit-cpi-modal/submit-cpi-modal.component';
import { SubmiteuroModalComponent } from './components/euro/submit-euro-modal/submit-euro-modal.component';
import { SubmitipcModalComponent } from './components/ipc/submit-ipc-modal/submit-ipc-modal.component';
import { SubmithorasPuntaModalComponent } from './components/horasPunta/submit-horasPunta-modal/submit-horasPunta-modal.component';
import { SubmitdollarModalComponent } from './components/dollar/submit-dollar-modal/submit-dollar-modal.component';
import { SubmitcombustibleModalComponent } from './components/combustible/submit-combustible-modal/submit-combustible-modal.component';
import { SubmitProviderModalComponent } from './components/providers/submit-provider-modal/submit-provider-modal.component';
import { SubmitClientModalComponent } from './components/clients/submit-client-modal/submit-client-modal.component';
import { ManualRegistrationModalComponent } from './components/meters/manual-registration-modal/manual-registration-modal.component';
import { FacturaEHHComponent } from './components/contracts/factura-ehh/factura-ehh.component';
import { ModalCargosEehComponent } from './components/contracts/modal-cargos-eeh/modal-cargos-eeh.component';
import { UsersComponent } from './components/users/users.component';
import { SubmitUserModalComponent } from './components/users/submit-user-modal/submit-user-modal.component';
import { CredentialUserModalComponent } from './components/users/credential-user-modal/credential-user-modal.component';
import { ReportsComponent } from './components/reports/reports.component';


@NgModule({
  declarations: [
    HomeComponent,
    MainPageComponent,
    ClientsComponent,
    ProvidersComponent,
    ZonesComponent,
    cpiComponent,
    ipcComponent,
    euroComponent,
    dollarComponent,
    horasPuntaComponent,
    combustibleComponent,
    MetersComponent,
    MetersModalComponent,
    VirtualMeterModalComponent,
    RatesComponent,
    InputParametersComponent,
    ContractsComponent,
    EnergyMatrixComponent,
    EspecialChargesComponent,
    ModalParametersComponent,
    ModalMedidoresComponent,
    ModalNewContractComponent,
    ModalNewParameterComponent,
    ModalNewChargeComponent,
    ModalNewMatrixComponent,
    ModalDistributionComponent,
    ModalNewRateComponent,
    ReportComponent,
    RollOverModalComponent,
    SubmitZoneModalComponent,
    SubmitcpiModalComponent,
    SubmitipcModalComponent,
    SubmiteuroModalComponent,
    SubmithorasPuntaModalComponent,
    SubmitcombustibleModalComponent,
    SubmitProviderModalComponent,
    SubmitClientModalComponent,
    SubmitClientModalComponent,
    ManualRegistrationModalComponent,
    FacturaEHHComponent,
    ModalCargosEehComponent,
    UsersComponent,
    SubmitUserModalComponent,
    CredentialUserModalComponent,
    ReportsComponent,
   SubmitdollarModalComponent,
  ],
  imports: [
    CommonModule,
    MenuLayoutRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    IconsProviderModule,
    SharedModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzGridModule,
    NzModalModule,
    NzRadioModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzAvatarModule,
    NzUploadModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzMessageModule,
    NzDropDownModule,
    NzPopconfirmModule
  ],
  bootstrap: [MainPageComponent],
})
export class MenuLayoutModule { }
