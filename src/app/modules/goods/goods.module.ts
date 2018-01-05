import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsRoutingModule } from './goods.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SortablejsModule } from 'angular-sortablejs/dist';
import {
    TSSelectModule,
    TSLoadingModule,
    TSDropdownModule,
    TSPaginationModule,
    TSConfirmModule,
    TSSwitchModule,
    TSFileModule,
    TSLoopCardModule,
} from '../../tools-ui';
import { GoodsInfoComponent } from './pages/goods-info/goods-info.component';
import { GoodsListComponent } from './pages/goods-list/goods-list.component';
import { GoodsTypeComponent } from './pages/goods-type/goods-type.component';
import { GoodsLoopComponent } from './pages/goods-loop/goods-loop.component';

@NgModule({
    imports: [
        CommonModule,
        GoodsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TSSelectModule,
        TSLoadingModule,
        TSDropdownModule,
        TSPaginationModule,
        TSConfirmModule,
        TSSwitchModule,
        TSFileModule,
        SortablejsModule,
        TSLoopCardModule,
    ],
    declarations: [
        GoodsInfoComponent,
        GoodsListComponent,
        GoodsTypeComponent,
        GoodsLoopComponent,
    ]
})
export class GoodsModule { }
