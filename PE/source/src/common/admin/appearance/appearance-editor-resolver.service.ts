import {Injectable} from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {AppHttpClient} from '../../core/http/app-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class AppearanceEditorResolver implements Resolve<any[]> {
    constructor(private http: AppHttpClient) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
        return this.http.get('admin/appearance/values').toPromise() as any;
    }
}

