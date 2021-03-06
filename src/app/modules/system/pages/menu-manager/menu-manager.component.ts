import { Component, OnInit } from '@angular/core';
import { Menus } from '../../../../config/menu.config';
import { RequestService } from '../../../../dashboard/services/request.service';
import { TSToastService, TSModalService } from '../../../../tools-ui';
import { MenuModelModalComponent } from './menu-model.modal';
import { MenuMainModalComponent } from './menu-main.modal';
import { FormService } from '../../../../dashboard/services/form.service';
import { ConfirmService } from '../../../../tools-ui/components/confirm/confirm.service';
import { MenuChildModalComponent } from './menu-child.modal';

@Component({
    selector: 'app-menu-manager',
    templateUrl: './menu-manager.component.html',
    styleUrls: ['./menu-manager.component.css']
})
export class MenuManagerComponent implements OnInit {

    menus = Array<{ title: string, id: number, menus: Array<any> }>();

    constructor(
        private request: RequestService,
        private toast: TSToastService,
        private modalService: TSModalService,
        private form: FormService,
        private confirm: ConfirmService,
    ) { }

    ngOnInit() {
        this.loadDatas();
    }

    loadDatas() {
        this.request.url('/menu/group').subscribe(res => {

            // 获取菜单模块
            this.menus = [];
            res.datas.models.forEach(model => {
                this.menus.push({ id: model.id, title: model.title, menus: [] });
            });

            // 获取菜单模块对应的主菜单
            const mains = new Array<{ id: number, icon: string, title: string, mid: number, children: any[] }>();
            for (let i = 0; i < res.datas.groups.length; i++) {
                if (res.datas.groups[i].parentid === 0) {
                    res.datas.groups[i].groups.forEach(e => {
                        mains.push({ id: e.id, icon: e.icon, title: e.title, mid: e.mid, children: [] });
                    });
                    res.datas.groups.splice(i, 1);
                    break;
                }
            }

            // 子菜单合并到主菜单中
            mains.forEach((e, i) => {
                mains[i].children = this.getChildByParentId(res.datas.groups, e.id);
            });

            // 主菜单合并到菜单模块中
            this.menus.forEach((menu, i) => {
                for (let j = 0; j < mains.length; j++) {
                    if (menu.id.toString() === mains[j].mid.toString()) {
                        this.menus[i].menus.push(mains[j]);
                    }
                }
            });
        });
    }

    getChildByParentId(childslist: any[], parentid: number): any[] {
        let childs = new Array<{ id: number, icon: string, title: string, url: string, parentid: number, permissionid: number }>();
        for (let i = 0; i < childslist.length; i++) {
            if (childslist[i].parentid.toString() === parentid.toString()) {
                childs = childslist[i].groups;
                break;
            }
        }
        return childs;
    }

    getMainByMid(mains: any[], mid: number): any[] {
        let main = [];
        for (let i = 0; i < mains.length; i++) {
            if (mains[i].mid.toString() === mid.toString()) {
                main = mains[i];
                break;
            }
        }
        return main;
    }

    // 显示菜单模块添加/编辑窗口
    showModelModal(model: any = null) {
        this.modalService.create(MenuModelModalComponent);
        if (model !== null) {
            this.modalService.modal.instance.model = this.form.jsonCopy(model);
        }
        this.modalService.open().next(() => {
            this.loadDatas();
        });
    }

    // 显示主菜单添加/编辑窗口
    showMainMenuModal(params: any) {
        this.modalService.create(MenuMainModalComponent);
        if (typeof params !== 'number') {
            this.modalService.modal.instance.menu = this.form.jsonCopy(params);
        } else {
            this.modalService.modal.instance.menu.mid = params;
        }
        this.modalService.open().next(() => {
            this.loadDatas();
        });
    }

    // 显示子菜单添加/编辑窗口
    showChildMenuModal(params: any, parentid = 0) {
        this.modalService.create(MenuChildModalComponent);
        if (parentid === 0) {
            params.permissionid = parseInt(params.permissionid.toString(), 10);
            this.modalService.modal.instance.menu = this.form.jsonCopy(params);
        } else {
            this.modalService.modal.instance.menu.mid = params;
            this.modalService.modal.instance.menu.parentid = parentid;
        }
        this.modalService.open().next(() => {
            this.loadDatas();
        });
    }

    // 确认模块排序
    confirmModelSort() {
        const ids = this.form.getIds(this.menus).join();
        this.request.put('/menu/model/sort', { ids }).subscribe(() => {
            this.loadDatas();
            this.toast.success('操作成功', '模块排序成功~');
        });
    }

    // 确认菜单排序
    confrimMenuSort(menus: any[]) {
        const ids = this.form.getIds(menus).join();
        this.request.put('/menu/sort', { ids }).subscribe(() => {
            this.loadDatas();
            this.toast.success('操作成功', '模块排序成功~');
        });
    }

    // 确认删除菜单
    confirmDeleteMenu(menu: any) {
        this.confirm.danger('确认删除', `您确定要删除菜单'${menu.title}'，操作不可回复！`, { okTitle: '确认', cancelTitle: '取消' })
            .next(() => {
                this.request.delete('/menu/delete', { menuid: menu.id }).subscribe(() => {
                    this.loadDatas();
                    this.toast.success('操作成功', '菜单删除成功~');
                });
            });
    }

    // 确认删除模块
    deleteModelConfirm(model: any) {
        this.confirm.danger('确认删除', `您确定要删除模块'${model.title}'，操作不可回复！`, { okTitle: '确认', cancelTitle: '取消' })
            .next(() => {
                this.request.delete('/menu/model/delete', { id: model.id }).subscribe(() => {
                    this.loadDatas();
                    this.toast.success('操作成功', '菜单模块删除成功~');
                });
            });
    }
}
