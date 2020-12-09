import {Observable} from 'rxjs';

type Generic<T extends {}> = T & {
    status: string
};

export interface BackendResponse<T> extends Observable<Generic<T>> {}
