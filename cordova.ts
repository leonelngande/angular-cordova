import { NgZone } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';

export namespace ZoneObservable {
    export function create(zone: NgZone, fn: (observer: any) => any): Observable<any> {
        return Observable.create((observer: any) => {
            fn({
                next: (emit: any) => {
                    zone.run(() => {
                        observer.next(emit)
                    });
                },
                error: (error: any) => {
                    zone.run(() => observer.next(error));
                },
                complete: () => {
                    zone.run(() => observer.complete());
                }
            });
        });
    }
    export function of(zone: NgZone, emit: any): Observable<any> {
        return Observable.create((observer: any) => {
            zone.run(() => observer.next(emit));
            zone.run(() => observer.complete());
        });
    }
}

export namespace Cordova {
    export const platformId: string = (<any>window).cordova.platformId;
    export const deviceready: Observable<any> = Observable.create((observer: any) => {
        let fn = () => {
            observer.next(null);
            observer.complete();
        }
        (<any>document).addEventListener('deviceready', fn, false);
        return () => {
            (<any>document).removeEventListener('deviceready', fn, false);
        };
    }).share();

    deviceready.subscribe();
}
