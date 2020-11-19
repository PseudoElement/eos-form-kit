import React, { useState, useCallback } from 'react';
import { Select as RcSelect, Spin } from "@eos/rc-controls";

/**
 * Структура и описание пропсов AjaxSelect
 */
export interface ISelect {
    /**
     * Объект для осуществления запроса
     */
    getDataService?: IGetDataService;

    /**
     * Функция для проставки параметров запроса
     */
    getData?: IGetRequestData;

    /**
     * Функция для проставки элементов списка
     */
    getOptionItems?: GetOptionItems;
    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;
    /**
     * Объект для отображения текста о количестве элементов
     */
    optionsAmountInfo?: any;

    /**
     * Передача formInst
     */
    form?: any;

    /**
     * Имя поля
     */
    fieldName?: string;

    /**
     * Объект значения поля
     */
    value?: IOptionItem;

    /**
     * Текст при отсутсвии элементов
     */
    notFoundContent?: string;

    /**
     * Обзяательность заполнения поля
     */
    required?: boolean;
}


/**
 * Метод для возврата объекта в парамерты запроса
 */
export interface IGetRequestData {
    /**
     * Проброс строки в парамерты запроса
     */
    (name: string): any;
}

/**
 * Метод для возврата объекта в элементы выпадающего списка
 */
export interface GetOptionItems {
    /**
     * Парсинг полученного объекта в объект IOptionItem типа {key, value}
     */
    (data: any): IOptionItem[];
}

/**
 * Структура элемента выпадающего списка
 */
export interface IOptionItem {
    /**
     * Программное значение которое вернёт компонент.
     */
    key?: string;

    /**
     * Отображаемый текст значения для пользователя.
     */
    value?: string;

    /**
     * Параметр запрета на выбор значения
     */
    disabled?: boolean;
}

/**
 * Структура объекта для запроса
 */
export interface IGetDataService {
    /**
     * Функция useLazyQuery для отправки и обработки запроса
     */
    loadDataAsync: IQuery;

    /**
     * Объект gql-запроса
     */
    query: any,

    /**
     * Количество запрашивамых результатов
     */
    resultsAmount: number
}

/**
 * Структура useLazyQuery
 */
export interface IQuery {
    /**
     * Парамерты функции useLazyQuery
     * query - объект gql-запроса
     * queryOption - параметры запроса
     */
    (query: any, queryOption?: any): any,
}

/**
 * Поле с выпадающим списком, реагирует на изменения в поле последующим запросом на совпадения по подстроке
 */
export const Select = React.forwardRef<any, ISelect>(({
    getData,
    getOptionItems,
    onChange,
    optionsAmountInfo,
    form,
    fieldName,
    value,
    notFoundContent,
    required,
    getDataService,
}, ref) => {
    /**
     * Объект значения
     */
    const [currentValue, setCurrentValue] = useState<IOptionItem | undefined>(value);

    /**
     * Значение имя поля по умолчанию
     */
    const DEFAULT_FIELD_NAME: string = "";

    /**
     * Проброс пустого массива в список при отсутствии запроса
     * @param data не имеет значения
     */
    const DEFAULT_GET_OPTION_ITEMS = (data: any): IOptionItem[] => { return data ? [] : []; };

    /**
     * Проброс пустого значения в параметры запроса
     * @param name не имеет значения
     */
    const DEFAULT_GET_DATA = (name: string): any => { return name ? null : null; };

    /**
     * Сообщение об отображаемом количестве элементов в выпадающем списке
     */
    const [queryAmountInfo, setQueryAmountInfo] = useState<string>("");

    /**
     * Время задержки отправки поискового запроса при изменении значения поля
     */
    const DEFAULT_SEARCH_DELAY_MS_VALUE: number = 200;

    /**
     * Элементы выпадающего списка
     */
    const [items, setItems] = useState<IOptionItem[]>([]);


    /**
     * Параметры запроса
     */
    const [loadItemById, { loading: isLoading }] = getDataService?.loadDataAsync(getDataService?.query, {
        // const [loadItemById, { called: isCalled, loading: isLoading, data: data }] = getDataService?.loadDataAsync(getDataService?.query, {
        onCompleted: useCallback(
            (data: any) => {
                let items: IOptionItem[] = getOptionItems ? getOptionItems(data) : DEFAULT_GET_OPTION_ITEMS(data);
                switch (true) {
                    case (items.length >= getDataService.resultsAmount):
                        // При количестве результатов 11 и более отображается надпись "Отображены первые 10 результатов"
                        let shortArray = items.slice(0, getDataService.resultsAmount - 1);
                        const QUERY_AMOUNT_INFO_TEXT: string = optionsAmountInfo.t(optionsAmountInfo.namespace, { amount: getDataService.resultsAmount - 1 });
                        // Добавляет в выпадающий список надпись "Отображены первые 10 результатов"
                        setQueryAmountInfo(QUERY_AMOUNT_INFO_TEXT);
                        setItems([...shortArray]);
                        break;
                    case (items.length && items.length <= getDataService.resultsAmount - 1):
                        // Убирает надпись "Отображены первые 10 результатов" при количестве элементов списка 10 и менее
                        setQueryAmountInfo("");
                        setItems(items);
                        break;
                    default:
                        setQueryAmountInfo("");
                        setItems([]);
                        break;
                }
            }, []),
        onError: useCallback((err: any) => {
            console.error(err);
            setItems([]);
        }, []),
    });

    /**
     * Очистка значения формы
     */
    let onClear = () => {
        setCurrentValue(undefined);
        setValueToForm(undefined);
        if (onChange)
            onChange(null);
    }

    /**
     * Отправка запроса на показ дополнительных вариантов введенного значения при фокусе на поле
     */
    let onFocus = () => {
        // Если поле со значением, то отправить запрос со значением на поиск
        if (currentValue?.value) {
            loadItemById(getData ? getData(currentValue?.value.trim()) : DEFAULT_GET_DATA(currentValue?.value.trim()));
        } else {
            // Если без - пустую строку на показ всех доступных значений
            loadItemById(getData ? getData("") : DEFAULT_GET_DATA(""));
        }
    }

    /**
     * Обработчик ввода в поле
     * @param value строкове значение, передаваемое в запрос на поиск
     */
    let handleSearch = (value: string) => {
        // Получить сделать запрос на получение данных по обрезанной строке
        loadItemById(getData ? getData(value.trim()) : DEFAULT_GET_DATA(value.trim()));

        // Приведение value полученных объектов к UpperCase для дальнейшего сравнения
        let options: any = items?.map(item => item.value?.toLocaleUpperCase());

        // Если есть options совпадающий с введенной строкой и они не равны пустой строке, то сделать значение выбранным, 
        // если нет - остается предыдущее введенное значение либо значение
        if (options?.indexOf(value?.toLocaleUpperCase().trim()) > -1 && value.trim() !== "") {

            // Проставить объект IOptionItem в отображение
            setCurrentValue({ value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key });

            // Проставить объект IOptionItem в форму
            setValueToForm({ value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key });
            // onSelectComponentChange(value, { value: value, label: value, item: { value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key } });
        }
    }

    /**
     * Проставка выбранного значения в поле
     * @param value строковое значение для проставки в поле
     * @param option объект {key, value, label(аналогичен value)}
     */
    let onSelect = (value: any, option: any) => {
        setCurrentValue(option?.item);
        setValueToForm(option?.item);
        if (onChange)
            onChange(option?.item);
        if (!value)
            console.log(value);
    }

    return (
        <Spin spinning={isLoading}>
            <RcSelect ref={ref}
                required={required}
                showSearch={true}
                // showArrow={false}
                value={currentValue?.value}
                notFoundContent={notFoundContent}
                handleSearch={handleSearch}
                onFocus={onFocus}
                onClear={onClear}
                onSelect={onSelect}
                delay={DEFAULT_SEARCH_DELAY_MS_VALUE}
                allowClear={true}
                options={
                    queryAmountInfo === ""
                        ? items.map((item: IOptionItem) => {
                            return {
                                value: item?.value ?? `${item.key}`,
                                label: item?.value ?? `${item.key}`,
                                item: item,
                                disabled: item?.disabled
                            }
                        })

                        : [{
                            label: queryAmountInfo,
                            options: items.map((item: IOptionItem) => {
                                return {
                                    value: item.value ?? `${item.key}`,
                                    label: item?.value ?? `${item.key}`,
                                    item: item,
                                    disabled: item?.disabled
                                }
                            })
                        }]
                }
            >
                {/* {options} */}
            </RcSelect >
        </Spin>
    );

    /**
     * Проставляет значение в форму.
     * @param value Значение для простановки в форму.
     */
    function setValueToForm(value?: IOptionItem): boolean {
        if (form && form.current) {
            const { ...fieldValues } = form.current.getFieldsValue();
            fieldValues[fieldName ?? DEFAULT_FIELD_NAME] = value;
            form.current.setFieldsValue(fieldValues);
            return true;
        }
        return false;
    }
});


