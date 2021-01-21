import { Store } from 'rc-field-form/lib/interface';

export interface IFilterValueObjects {
    /** Строка быстрого поиска */
    quickSearchFilter?: string
    /** Данные с формы фильтрации */
    formFilter?: Store   
    /** Внешние фильтрующие данные */ 
    externalFilter?: any
}