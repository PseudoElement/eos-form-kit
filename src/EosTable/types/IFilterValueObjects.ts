import { Store } from 'rc-field-form/lib/interface';

export interface IFilterValueObjects {
    quickSearchFilter?: string
    formFilter?: Store    
    [key: string]: any
}