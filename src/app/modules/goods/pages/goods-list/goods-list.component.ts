import { Component, OnInit, ViewChild } from '@angular/core';
import { Pagination, SearchParams, TSConfirmService } from './../../../../tools-ui';
import { RouterOutlet } from '@angular/router';
import { RequestService } from '../../../../dashboard/services/request.service';
import { AppConfig } from '../../../../config/app.config';
import { HttpConfig } from '../../../../config/http.config';

@Component({
    templateUrl: './goods-list.component.html',
    styleUrls: ['./goods-list.component.css']
})
export class GoodsListComponent implements OnInit {

    @ViewChild('loading') flash: any;
    @ViewChild(RouterOutlet) outlet: any;

    // 分页参数
    pagination = new Pagination();

    // 查询参数
    search = new SearchParams({ name: '', type: '', status: '' });

    // 表格数据
    list = new Array<{ id: number, no: string, name: string, price: number, inventory: number, thumb: string, status: number }>();

    // 表格标题
    theads = new Array<string>();

    // 资源地址
    source = HttpConfig.SOURCE_URL;

    constructor(private confirm: TSConfirmService, private request: RequestService) { }

    ngOnInit() {

        // 载入表格数据
        this.theads = ['No.', '图片', '商品名称', '单价', '库存', '状态', '操作'];
        this.pageChanged();
    }

    // 删除方法
    deleteItem(i: number) {
        this.confirm.danger('危险操作', `确认删除 ${this.list[i].name} ，操作不可恢复！`, { okTitle: '确认', cancelTitle: '取消' }).next(() => {
            this.pageChanged();
        });
    }

    // 换页事件(特别的更改每页数据量也会触发此事件)
    pageChanged() {
        this.flash.loading();
        this.request.get('/goods/search', this.pagination.getpageDataWith(this.search.values), false).subscribe(res => {
            if (res.result) {
                this.list = res.datas.rows;
                this.pagination.total = res.datas.total;
            }
            this.flash.complete();
        });
    }

    // 搜索方法
    doSearch() {
        this.pageChanged();
    }

    // 重置搜索
    resetSearch() {
        this.search.clean();
        this.pageChanged();

    }
}