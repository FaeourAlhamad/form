import { Inject, Injectable, InjectionToken, EventEmitter } from '@angular/core';
export const formAppConfig = new InjectionToken('form-config');
import { formCore as form } from '@form/js';
@Injectable()
export class formAppService {
    baseUrl;
    apiUrl;
    projectUrl;
    appUrl;
    icons?: string;
    form: form;
    user?: any;
    onUser: EventEmitter<object> = new EventEmitter<object>();
    constructor(@Inject(formAppConfig) config: {
        apiUrl?: string,
        baseUrl?: string,
        appUrl?: string,
        projectUrl?: string,
        icons?: string,
        config?: any
    } = {}) {
        this.baseUrl = this.apiUrl = config.apiUrl || config.baseUrl;
        this.projectUrl = this.appUrl = config.appUrl || config.projectUrl;
        if (this.baseUrl) {
            form.setBaseUrl(this.baseUrl);
            form.setProjectUrl(this.projectUrl);
            if (config.icons) {
                form.icons = config.icons;
            }
            if (config.config) {
                for (let key in config.config) {
                    form.config[key] = config.config[key];
                }
            }
            form.events.on('form.user', (user) => this.setUser(user));
            this.form = new form(this.projectUrl);
            this.authenticate();
        }
    }

    setUser(user) {
        this.user = user;
        this.onUser.emit(user);
    }

    logout() {
        return form.logout().then(() => {
            this.setUser(null);
            form.clearCache();
        }).catch(() => {
            this.setUser(null);
            form.clearCache();
        });
    }

    authenticate() {
        return this.form.currentUser().then((user) => this.setUser(user)).catch(() => this.setUser(null));
    }
}