import React, { useEffect, useState } from 'react';
import { AutoComplete as RcAutoComplete, Spin, Button, DirectoryBookIcon } from '@eos/rc-controls';

/**
 * Структура и описание пропсов AjaxAutoComplete
 */
export interface IAutoComplete {
    /**
     * Объект для осуществления запроса
     */
    dataService?: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

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

    /** конекст */
    ctx?: any;

    /** Событие при клике на кнопку */
    onButtonClick?(): void
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
export const AutoComplete = React.forwardRef<any, IAutoComplete>(({
    onChange,
    fieldName,
    value,
    notFoundContent,
    required,
    dataService: getDataService,
    ctx,
    onButtonClick
}, ref) => {

    /**
     * Объект значения
     */
    const [currentValue, setCurrentValue] = useState<IOptionItem | undefined>(value);
    useEffect(() => {
        setCurrentValue(value);
    }, [value])
    /**
     * Объект индикатор загрузки
     */
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Текстовое значение поля
     */
    // const [currentTextValue, setCurrentTextValue] = useState<string>(currentValue ? (currentValue.value ? currentValue.value : '') : '');

    /**
     * Значение имя поля по умолчанию
     */
    //const DEFAULT_FIELD_NAME: string = "";

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
     * @param param параметры запроса
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
     * Вызывается при нажатии на крестик
     */
    let onClear = () => {
        setCurrentValue(undefined);
        setValueToForm(undefined);
        if (onChange)
            onChange(null);
    }

    /** Вызывается при фокусе и отображает список схожих элементов */
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
        value = value ? value : '';
        // setCurrentTextValue(value)
        // Получить сделать запрос на получение данных по обрезанной строке
        loadItemById(value?.trim());

        // Приведение value полученных объектов к UpperCase для дальнейшего сравнения
        let options: any = items?.map(item => item.value?.toLocaleUpperCase());

        // Если есть options совпадающий с введенной строкой и они не равны пустой строке, то сделать значение выбранным, 
        // если нет - остается предыдущее введенное значение либо значение
        if (options?.indexOf(value?.toLocaleUpperCase().trim()) > -1 && value.trim() !== "") {

            // Проставить объект IOptionItem в отображение
            setCurrentValue({ value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key });

            // Проставить объект IOptionItem в форму
            setValueToForm({ value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key });
            if (onChange)
                onChange({ value: value, key: items[options.indexOf(value.toLocaleUpperCase().trim())].key });
        } else {
            setCurrentValue(undefined);
            setValueToForm(undefined);
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
        if (!value) { }
    }

    return (
        <Spin spinning={isLoading}>
            <div style={{display: "flex"}}>
                <RcAutoComplete ref={ref}
                    // При возвращении контролу AutoComplete свойства для отображения красной точки обязательности заполнения поля при пустом его значении - раскомментить
                    // required={required}
                    // При появлении у контрола AutoComplete свойства для отображения иконки лупы - добавить
                    notFoundContent={notFoundContent}
                    value={currentValue?.value}
                    allowClear={true}
                    onSelect={onSelect}
                    onFocus={onFocus}
                    delay={DEFAULT_SEARCH_DELAY_MS_VALUE}
                    onClear={onClear}
                    required={required}
                    onSearch={handleSearch}
                    options={
                        queryAmountInfo === ''
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
                    }>
                </RcAutoComplete >
                    {onButtonClick && <Button onClick={onButtonClick}>
                        <DirectoryBookIcon />
                    </Button>}
            </div>
        </Spin>
    );

    /**
     * Проставляет значение в форму.
     * @param value Значение для простановки в форму.
     */
    function setValueToForm(value?: IOptionItem): boolean {
        if (ctx) {
            ctx.setFieldValue(fieldName, value);
            return true;
        }
        return false;
    }
});