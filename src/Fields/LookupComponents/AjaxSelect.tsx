import React, { useState } from 'react';
import { Select as RcSelect, Spin } from "@eos/rc-controls";

/**
 * Структура и описание пропсов AjaxSelect
 */
export interface ISelect {
    /**
     * Объект для осуществления запроса
     */
    dataService?: IDataService;

  
    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;
  
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

export interface IDataService {
    /**
     * Функция useLazyQuery для отправки и обработки запроса
     */
    loadDataAsync(search?: string): Promise<IOptionItem[]>;

    /**
     * Количество запрашивамых результатов
     */
    resultsAmount: number;
}

/**
 * Поле с выпадающим списком, реагирует на изменения в поле последующим запросом на совпадения по подстроке
 */
export const Select = React.forwardRef<any, ISelect>(({
    onChange,
    form,
    fieldName,
    value,
    notFoundContent,
    required,
    dataService: getDataService,
    // передача функции useTranslate t(`Отображены первые ${getDataService.resultsAmount} результатов`;)
    // optionsAmountInfo
}, ref) => {
    /**
     * Объект значения
     */
    const [currentValue, setCurrentValue] = useState<IOptionItem | undefined>(value);

    /**
     * Объект индикатор загрузки
     */
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Значение имя поля по умолчанию
     */
    const DEFAULT_FIELD_NAME: string = "";

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
     * Запрос
     * @search search параметры запроса
     */
    async function loadItemById(search?: string) {
        setIsLoading(true);
        return getDataService?.loadDataAsync(search).then(
            (data: IOptionItem[]) => {
                let items: IOptionItem[] = data;
                switch (true) {
                    case (items.length >= getDataService.resultsAmount):
                        // При количестве результатов 11 и более отображается надпись "Отображены первые 10 результатов"
                        let shortArray = items.slice(0, getDataService.resultsAmount - 1);
                        // Использование useTranslate
                        // const QUERY_AMOUNT_INFO_TEXT: string = optionsAmountInfo.t(optionsAmountInfo.namespace, { amount: getDataService.resultsAmount - 1 });
                        const QUERY_AMOUNT_INFO_TEXT: string = `Отображены первые ${getDataService.resultsAmount - 1} результатов`;
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
                setIsLoading(false);
            }
        )
        .catch(
            (err: any) => {
                console.error(err);
                setQueryAmountInfo("");
                setItems([]);
                setIsLoading(false)
            }
        )
    }

    /**
     * Параметры запроса
     */
    // const [loadItemById, { loading: isLoading }] = getDataService?.loadDataAsync(getDataService?.query, {
    //     // const [loadItemById, { called: isCalled, loading: isLoading, data: data }] = getDataService?.loadDataAsync(getDataService?.query, {
    //     onCompleted: useCallback(
    //         (data: any) => {
    //             let items: IOptionItem[] = getOptionItems ? getOptionItems(data) : DEFAULT_GET_OPTION_ITEMS(data);
    //             console.log('items', items)
    //             switch (true) {
    //                 case (items.length >= getDataService.resultsAmount):
    //                     // При количестве результатов 11 и более отображается надпись "Отображены первые 10 результатов"
    //                     let shortArray = items.slice(0, getDataService.resultsAmount - 1);
    //                     const QUERY_AMOUNT_INFO_TEXT: string = optionsAmountInfo.t(optionsAmountInfo.namespace, { amount: getDataService.resultsAmount - 1 });
    //                     // Добавляет в выпадающий список надпись "Отображены первые 10 результатов"
    //                     setQueryAmountInfo(QUERY_AMOUNT_INFO_TEXT);
    //                     setItems([...shortArray]);
    //                     break;
    //                 case (items.length && items.length <= getDataService.resultsAmount - 1):
    //                     // Убирает надпись "Отображены первые 10 результатов" при количестве элементов списка 10 и менее
    //                     setQueryAmountInfo("");
    //                     setItems(items);
    //                     break;
    //                 default:
    //                     setQueryAmountInfo("");
    //                     setItems([]);
    //                     break;
    //             }
    //         }, []),
    //     onError: useCallback((err: any) => {
    //         console.error(err);
    //         setItems([]);
    //     }, []),
    // });

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
            loadItemById(currentValue?.value?.trim());
        } else {
            // Если без - пустую строку на показ всех доступных значений
            loadItemById("");
        }
    }

    /**
     * Обработчик ввода в поле
     * @param value строкове значение, передаваемое в запрос на поиск
     */
    let handleSearch = (value: string) => {
        // Получить сделать запрос на получение данных по обрезанной строке
        loadItemById(value.trim());

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