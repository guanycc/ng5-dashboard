import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Breadcrumbs } from './../../dashboard/classes/breadcrumb.class';
import { BreadcrumbService } from './../../dashboard/services/breadcrumb.service';
import { SimpleComponent } from './pages/simple/simple.component';
import { SelectComponent } from './pages/select/select.component';
import { CheckboxComponent } from './pages/checkbox/checkbox.component';


const routes: Routes = [
  { path: 'simple', component: SimpleComponent, data: { breadcrumbs: new Breadcrumbs([['表单', 'list-alt'], ['简单表单', 'tablet']]) } },
  { path: 'checkbox', component: CheckboxComponent, data: { breadcrumbs: new Breadcrumbs([['表单', 'list-alt'], ['勾选框', 'check-square-o']]) } },
  { path: 'select', component: SelectComponent, data: { breadcrumbs: new Breadcrumbs([['表单', 'list-alt'], ['下拉选择', 'caret-down']]) } },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class FormRoutingModule {
  constructor(breadcrumbService: BreadcrumbService) {
    breadcrumbService.append('form', routes);
  }
}