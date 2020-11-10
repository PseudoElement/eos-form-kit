// import React, { useState, useCallback, useEffect } from 'react';
// import { Select, Spin } from 'eos-webui-controls';

// /**
//  * Структура и описание пропсов AjaxSelect
//  */
// export interface IAjaxSelect {
//     /**
//      * Объект для осуществления запроса
//      */
//     getDataService?: IGetDataService;

//     /**
//      * Функция для проставки параметров запроса
//      */
//     getData?: IGetRequestData;

//     /**
//      * Функция для проставки элементов списка
//      */
//     getOptionItems?: GetOptionItems;

//     /**
//      * Объект для отображения текста о количестве элементов
//      */
//     optionsAmountInfo?: any;

//     /**
//      * Передача formInst
//      */
//     form?: any;

//     /**
//      * Имя поля
//      */
//     fieldName?: string;

//     /**
//      * Ограничения на максимальную длину поля
//      */
//     maxLength?: number;

//     /**
//      * Объект значения поля
//      */
//     value?: IOptionItem;

//     /**
//      * Текст при отсутсвии элементов
//      */
//     notFoundContent?: string;

//     /**
//      * Обзяательность заполнения поля
//      */
//     required?: boolean;
// }

// /**
//  * Метод для возврата объекта в парамерты запроса
//  */
// export interface IGetRequestData {
//     /**
//      * Проброс строки в парамерты запроса
//      */
//     (name: string): any;
// }

// /**
//  * Метод для возврата объекта в элементы выпадающего списка
//  */
// export interface GetOptionItems {
//     /**
//      * Парсинг полученного объекта в объект IOptionItem типа {key, value}
//      */
//     (data: any): IOptionItem[];
// }

// /**
//  * Структура элемента выпадающего списка
//  */
// export interface IOptionItem {
//     /**
//      * Программное значение которое вернёт компонент.
//      */
//     key?: string;

//     /**
//      * Отображаемый текст значения для пользователя.
//      */
//     value?: string;
// }

// /**
//  * Структура объекта для запроса
//  */ 
// export interface IGetDataService {
//     /**
//      * Функция useLazyQuery для отправки и обработки запроса
//      */
//     loadDataAsync: IQuery;

//     /**
//      * Объект gql-запроса
//      */
//     query: any,

//     /**
//      * Количество запрашивамых результатов
//      */
//     resultsAmount: number
// }

// /**
//  * Структура useLazyQuery
//  */
// export interface IQuery {
//     /**
//      * Парамерты функции useLazyQuery
//      * query - объект gql-запроса
//      * queryOption - параметры запроса
//      */
//     (query: any, queryOption?: any): any,
// }

// const AjaxSelect = React.forwardRef<any, IAjaxSelect>(({
//     getData,
//     getOptionItems,
//     optionsAmountInfo,
//     form,
//     fieldName,
//     maxLength,
//     value,
//     notFoundContent,
//     required,
//     getDataService
// }, ref) => {
//     /**
//      * Значение имя поля по умолчанию
//      */
//     const DEFAULT_FIELD_NAME: string = "";

//     /**
//      * Проброс пустого массива в список при отсутствии запроса
//      * @param data не имеет значения
//      */
//     const DEFAULT_GET_OPTION_ITEMS = (data: any): IOptionItem[] => { return []; };

//     /**
//      * Проброс пустого значения в параметры запроса
//      * @param name не имеет значения
//      */
//     const DEFAULT_GET_DATA = (name: string): any => { return null };

//     /**
//      * Значение формы по умолчанию
//      */
//     const [isDefaultValue, setDefaultValue] = useState(true);

//     /**
//      * Сохранение значения инпута
//      */
//     const [inputValue, setInputValue] = useState<any>(value?.value || undefined);

//     /**
//      * Сообщение об отображаемом количестве элементов в выпадающем списке
//      */
//     const [queryAmountInfo, setQueryAmountInfo] = useState<string>("");
    
//     /**
//      * Время задержки отправки поискового запроса при изменении значения поля
//      */
//     const DEFAULT_SEARCH_DELAY_MS_VALUE: number = 200;

//     /**
//      * Элементы выпадающего списка
//      */
//     const [items, setItems] = useState<IOptionItem[]>([]);
//     useEffect(() => {
//         if (value?.key && isDefaultValue) {
//             if (setValueToForm(value?.key)) {
//                 setDefaultValue(false);
//             }
//         }
//     }, []);
    
//     /**
//      * Параметры запроса
//      */
//     const [loadItemById, { called: isCalled, loading: isLoading, data: data }] = getDataService?.loadDataAsync(getDataService?.query, {
//         onCompleted: useCallback(
//             (data: any) => {
//                 let items: IOptionItem[] = getOptionItems ? getOptionItems(data) : DEFAULT_GET_OPTION_ITEMS(data);
//                 switch (true) {
//                     case (items.length >= getDataService.resultsAmount):
//                         let shortArray = items.slice(0, getDataService.resultsAmount - 1);
//                         const QUERY_AMOUNT_INFO_TEXT: string = optionsAmountInfo.t(optionsAmountInfo.namespace, { amount: getDataService.resultsAmount - 1 });
//                         setQueryAmountInfo(QUERY_AMOUNT_INFO_TEXT);
//                         setItems([...shortArray]);
//                         break;
//                     case (items.length && items.length <= getDataService.resultsAmount - 1):
//                         setQueryAmountInfo("");
//                         setItems(items);
//                         break; 
//                     default:
//                         setQueryAmountInfo("");
//                         setItems([]);
//                         break;
//                 }
//             }, []),
//         onError: useCallback((err: any) => {
//             console.error(err);
//             setItems([]);
//         }, []),
//     });

//     /**
//      * Обработчик ввода в поле
//      * @param value строкове значение, передаваемое в запрос на поиск
//      */
//     let handleSearch = (value: string) => {
//         loadItemById(getData ? getData(value.trim()) : DEFAULT_GET_DATA(value.trim()));
//         let options: any = items?.map(item => item.value?.toLocaleUpperCase());
//         if (options?.indexOf(value?.toLocaleUpperCase().trim()) > -1 && value.trim() !== "") {
//             onChange(value, {value: value, label: value, item: {value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key}});
//         }
//     }

//     /**
//      * Реализует отправку запроса, для отображения выпадающего списка с совпадениями.
//      * Не работает на запрос значения, взятого из ключа.
//      * Т.е. если пришел объект {key: 123, name: null}, поиск будет происходить по имени, а не по ключу, из-за чего ответ на запрос будет пустым.
//      */
//     let onFocus = () => {
//         setValueToForm(inputValue);
//         if (inputValue) {
//             loadItemById(getData ? getData(inputValue.trim()) : DEFAULT_GET_DATA(inputValue.trim()));
//         } else {
//             loadItemById(getData ? getData("") : DEFAULT_GET_DATA(""));
//         }
//     }

//     /**
//      * Реализует сохранение введенного и совпадающего с предложенными вариантами значения в поле.
//      * Не работает на сохранение значения, взятого из ключа.
//      * Т.е. если пришел объект {key: 123, name: null}, поиск будет происходить по имени, а не по ключу, из-за чего ответ на запрос будет пустым.
//      */
//     let onBlur = () => {
//         if (inputValue) {
//             let options: any = items?.map(item => item.value?.toLocaleUpperCase());
//             if (options?.indexOf(inputValue?.toLocaleUpperCase().trim()) > -1 && inputValue.trim() !== "") {
//                 setValueToForm(items[options.indexOf(inputValue.toLocaleUpperCase().trim())].key);
//                 setInputValue(inputValue)
//             } else {
//                 setInputValue(inputValue)
//             }
//         } else {
//             setInputValue(inputValue)
//         }
//     }

//     /**
//      * Обработчик изменений в поле
//      * @param value строковое значение для проставки в поле
//      * @param option объект {key, value, label(аналогичен value)}
//      */
//     let onChange = (value: any, option: any) => {
//         let options: any = items?.map(item => item.value?.toLocaleUpperCase());
//         if (options?.indexOf(value?.toLocaleUpperCase().trim()) > -1 && value.trim() !== "") {
//             setValueToForm(items[options.indexOf(value.toLocaleUpperCase().trim())].key);
//             setInputValue(value)
//             loadItemById(getData ? getData(value.trim()) : DEFAULT_GET_DATA(value.trim()));
//         } else {
//             setValueToForm(null);
//             setInputValue(undefined)
//             loadItemById(getData ? getData("") : DEFAULT_GET_DATA(""));
//         }
//     }

//     /**
//      * Обработчик поиска
//      * @param value строковое значение для проставки в поле
//      */
//     let onSearch = (value: string) => {
//         loadItemById(getData ? getData(value) : DEFAULT_GET_DATA(value));
//     }

//     /**
//      * Проставка выбранного значения в поле
//      * @param value строковое значение для проставки в поле
//      * @param option объект {key, value, label(аналогичен value)}
//      */
//     let onSelect = (value: any, option: any) => {
//         setInputValue(value)
//     }

//     return (
//         <Spin spinning={isLoading}>
//             <Select ref={ref}
//                 required={required}
//                 showSearch={true}
//                 showArrow={false}
//                 value={inputValue}
//                 notFoundContent={notFoundContent}
//                 handleSearch={handleSearch}
//                 onFocus={onFocus}
//                 onBlur={onBlur}
//                 onChange={onChange}
//                 onSelect={onSelect}
//                 onSearch={onSearch}
//                 delay={DEFAULT_SEARCH_DELAY_MS_VALUE}
//                 allowClear={true}
//                 options={
//                     queryAmountInfo === ""  
//                         ? items.map((item: IOptionItem) => {
//                                 return {
//                                     value: item?.value ?? `${item.key}`,
//                                     label: item?.value ?? `${item.key}`,
//                                     item: item,
//                                 }
//                             })
                        
//                         : [{
//                                 label: queryAmountInfo,
//                                 options: items.map((item: IOptionItem) => {
//                                     return {
//                                         value: item.value ?? `${item.key}`,
//                                         label: item?.value ?? `${item.key}`,
//                                         item: item,
//                                     }
//                                 })
//                             }]
//                 }
//                 >
//                     {/* {options} */}
//             </Select >
//         </Spin>
//     );

//     /**
//      * Проставляет значение в форму.
//      * @param value Значение для простановки в форму.
//      */
//     function setValueToForm(value: any): boolean {
//         if (form && form.current) {
//             const { ...fieldValues } = form.current.getFieldsValue();
//             fieldValues[fieldName ?? DEFAULT_FIELD_NAME] = value;
//             form.current.setFieldsValue(fieldValues);
//             return true;
//         }
//         return false;
//     }
// });

// /**
//  * Поле с выпадающим списком, реагирует на изменения в поле последующим запросом на совпадения по подстроке
//  */
// export default AjaxSelect;