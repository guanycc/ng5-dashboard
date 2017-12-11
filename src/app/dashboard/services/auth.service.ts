import { Injectable } from '@angular/core';
import { Routes, Route } from '@angular/router';
import { Breadcrumbs, Breadcrumb } from './../classes/breadcrumb.class';
import { AppConfig } from '../../config/app.config';
import { StorageService } from './storage.service';
import { RequestService } from './request.service';
import { ApiData } from '../classes/api.class';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

    private loginState = true;

    constructor(private storageService: StorageService, private request: RequestService) { }

    setOut() {
        this.loginState = false;
    }

    setIn() {
        this.loginState = true;
    }

    get isLoggedIn(): boolean {
        return this.loginState;
    }

    checkLogin(): Observable<boolean> | boolean {
        return this.loginState || this.checkToken();
    }

    checkToken(): Observable<boolean> | boolean {
        return this.storageService.empty(AppConfig.tokenParams) ?
            false : this.request.withoutHeader().post(AppConfig.tokenCheckUrl, this.getToken()).map<ApiData, boolean>(res => res.result);
    }

    saveToken(params: { [key: string]: string }) {
        const tokenParams: { [key: string]: string } = {};
        AppConfig.tokenParams.forEach(key => {
            tokenParams[key] = params[key] || '';
        });
        this.storageService.sets(tokenParams);
    }

    getToken(): { [key: string]: string } {
        return this.storageService.gets(AppConfig.tokenParams);
    }
}
