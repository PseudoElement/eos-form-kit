import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { Select as RcSelect, Spin, Button, DirectoryBookIcon } from "@eos/rc-controls";

/** Структура и описание пропсов AjaxSelect */
export interface ISelect {
    /** Объект для осуществления запроса */
    dataService?: IDataService;

    /**Вызовется, когда значение поля изменится. */
    onChange?(item?: any): void;

    /** Имя поля */
    fieldName?: string;

    /** Объект значения поля*/
    value?: IOptionItem;

    /** Текст при отсутсвии элементов */
    notFoundContent?: string;

    /** Обзяательность заполнения поля */
    required?: boolean;

    /** конекст */
    ctx?: any;

    /** ручной ввод */
    manualInputAllowed?: boolean;

    /** инфо текст */
    resultInfoText?: string;

    /** отображение инфо текста */
    showResultInfoText?: boolean;

    /** Событие при клике на кнопку */
    onButtonClick?(): void

    /** значение свойства 
     * Необходимо так же передать 
     * значения берутся из useHistorySlim().getStateByName( "LookupDialogResult" )
     * keyProperty
     * loadData2Async в dataService
    */    
    valueProperty?: string;
    
    /** ключ свойства 
     * Необходимо так же передать 
     * значения берутся из useHistorySlim().getStateByName( "LookupDialogResult" )
     * valueProperty
     * loadData2Async в dataService
    */    
    keyProperty?: string;

    /** объект из useBackUrlHistory useHistorySlim().getStateByName( "LookupDialogResult" ) */
    receivedValue?: any;
}

/** Структура элемента выпадающего списка */
export interface IOptionItem {
    /** Программное значение которое вернёт компонент. */
    key?: string;

    /** Отображаемый текст значения для пользователя. */
    value?: string;

    /** Параметр запрета на выбор значения */
    disabled?: boolean;

    /** Значения других полей */
    other?: IOtherValue[];

    /** Подскраска поля (необходима для выделения структурного признака синим цветом) */
    isSpecific?: boolean;
}

/** Структура других полей */
export interface IOtherValue {
    /**Наименование поля. */
    name: string;
    /**Отображаемый текст значения для пользователя. */
    value?: string;
}

/** Управление запросом */
export interface IDataService {
    /** Функция useLazyQuery для отправки и обработки запроса */
    loadDataAsync(search?: string): Promise<IOptionItem[]>;

    /** метод для справочников 
     * Необходимо так же передать 
     * значения берутся из useHistorySlim().getStateByName( "LookupDialogResult" )
     * keyProperty
     * valueProperty
     * loadData2Async в dataService
    */
    loadData2Async?(search?: string): Promise<any[]>;

    /** Количество запрашивамых результатов */
    resultsAmount?: number;
}

/** Поле с выпадающим списком, реагирует на изменения в поле последующим запросом на совпадения по подстроке */
export const Select = React.forwardRef<any, ISelect>((props: ISelect) => {
    /** Объект значения */
    const [currentValue, setCurrentValue] = useState<IOptionItem | undefined>(props.value);
    useEffect(() => {
        setCurrentValue(props.value);
    }, [props.value]);

    useEffect(() => {
        if (props.keyProperty !== null && props.keyProperty !== undefined 
            && props.valueProperty !== null && props.valueProperty !== undefined
            && props.receivedValue?.[props.keyProperty]?.[0]?.data?.[props.keyProperty] !== null && props.receivedValue?.[props.keyProperty]?.[0]?.data?.[props.keyProperty] !== undefined
            && props.receivedValue?.[props.keyProperty]?.[0]?.data?.[props.valueProperty] !== null && props.receivedValue?.[props.keyProperty]?.[0]?.data?.[props.valueProperty] !== undefined) {
                let tempValue = {
                    key: props.receivedValue[props.keyProperty][0].data[props.keyProperty],
                    value: props.receivedValue[props.keyProperty][0].data[props.valueProperty]
                };
                setCurrentValue(tempValue);
                setValueToForm(tempValue);
                if (props.onChange) {
                    props.onChange(tempValue);
                }
            }
    }, [props.receivedValue]);

    /** Объект индикатор загрузки */
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /** Индикатор открытия списка */
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /** Цвет особого элемента списка */
    const SPECIFIC_ELEM_COLOR_VALUE: string = "#2196F3";
    /** Цвет задизейбленного элемента списка */
    const DISABLED_ELEM_COLOR_VALUE: string = "#BABABA";
    /** Ключ для информационного элемента списка (количество элементов) */
    const INFO_ELEM_KEY_VALUE: string | number = "queryAmountInfo";
    /** Текстовое значение информационного элемента списка */
    const INFO_ELEM_TEXT_VALUE: string = getInfoText();

    /** Значение типа курсора при наведении на информационный жлемент списка */
    const INFO_ELEM_CURSOR_VALUE: string = "default";

    /** Время задержки отправки поискового запроса при изменении значения поля */
    const DEFAULT_SEARCH_DELAY_MS_VALUE: number = 200;

    /** Элементы выпадающего списка */
    const [items, setItems] = useState<IOptionItem[]>([]);

    /** Индикатора показа инфотекста */
    const [showInfo, setShowInfo] = useState<boolean>();

    /** Реф для установки фокуса */
    const focusRef = useRef<any>();

    /** Идникатор количества элементов (при кол-во эл-тов = 1 - сделать его активным для выбора) */
    const [isSingleElem, setIsSingleElem] = useState<boolean>();

    /** Запрос
     * @search параметры запроса
     */
    async function loadItemById(search?: string) {
        setIsLoading(true);
        if (props.keyProperty && props.valueProperty && props.dataService?.loadData2Async) {
            return props.dataService?.loadData2Async(search ?? '')
                .then((data: any[]) => {
                    const preparedData = prepareData(data);
                    loadItemsSucceeeded(preparedData);
                })
                .catch((err: any) => {
                    loadItemsFailed(err);
                })
        }
        else {
            return props.dataService?.loadDataAsync(search ?? '')
                .then((data: IOptionItem[]) => {
                    loadItemsSucceeeded(data);
                })
                .catch((err: any) => {
                    loadItemsFailed(err);
                })
        }

    }

    function loadItemsSucceeeded(data: IOptionItem[]) {
        let items: IOptionItem[] = data;
        if (props.dataService?.resultsAmount !== null && props.dataService?.resultsAmount !== undefined) {
            if (items?.length >= props.dataService?.resultsAmount) {
                let shortArray = items?.slice(0, props.dataService?.resultsAmount - 1);
                if (props.showResultInfoText === true || props.showResultInfoText === undefined) {
                    setShowInfo(true);
                }
                setIsSingleElem([...shortArray].length === 1);
                setItems([...shortArray]);
            } 
            else {
                setShowInfo(false)
                setIsSingleElem(items?.length === 1);
                setItems(items);
            }
        }
        else {
            if (props.showResultInfoText === true || props.showResultInfoText === undefined) {
                setShowInfo(true);
            }      
            setIsSingleElem(items?.length === 1);       
            setItems(items);
        }
        setIsLoading(false);
    }

    function prepareData(data: any[]): IOptionItem[] {
        let result: IOptionItem[] = [];
        if (props.keyProperty !== null && props.keyProperty !== undefined && props.valueProperty !== null && props.valueProperty !== undefined) {
            data.forEach((item: any) => {
                if (props.keyProperty !== null && props.keyProperty !== undefined && props.valueProperty !== null && props.valueProperty !== undefined) {
                    result.push({
                        key: item?.data?.[props.keyProperty],
                        value: item?.data?.[props.valueProperty]
                    });
                }
            })
        }
        return result; 
    }

    function loadItemsFailed(err: any) {
        console.error(err);
        setItems([]);
        setIsLoading(false)
    }

    /** Очистка значения формы */
    let onClear = () => {
        setCurrentValue(undefined);
        setValueToForm(undefined);
        if (props.onChange)
        props.onChange(null);
        loadItemById("");
    }

    /** Отправка запроса на показ дополнительных вариантов введенного значения при фокусе на поле */
    let onFocus = () => {
        // Если поле со значением, то отправить запрос со значением на поиск
        if (currentValue?.value) {
            loadItemById(currentValue?.value?.trim());
        } 
        else {
            // Если без - пустую строку на показ всех доступных значений
            loadItemById("");
        }
        setIsOpen(true)
    }

    /** Обработчик ввода в поле
     * @param value строкове значение, передаваемое в запрос на поиск
     */
    let handleSearch = (value?: string) => {
        // Получить сделать запрос на получение данных по обрезанной строке
        value = value?.trim() ?? '';
        loadItemById(value);

        // Приведение value полученных объектов к UpperCase для дальнейшего сравнения
        let options: any = items?.map(item => item?.value?.toLocaleUpperCase());

        // Если есть options совпадающий с введенной строкой и они не равны пустой строке, то сделать значение выбранным, 
        // если нет - остается предыдущее введенное значение либо значение
        if (options?.indexOf(value?.toLocaleUpperCase().trim()) > -1 && value?.trim() !== "") {
            // не проставлять задизейбленный элемент
            if (!items[options.indexOf(value?.toLocaleUpperCase().trim())].disabled) {
                // Проставить объект IOptionItem в отображение
                setIsSingleElem(items?.length === 1);
                setCurrentValue({ value: value, key: items[options.indexOf(value?.toLocaleUpperCase().trim())].key });

                // Проставить объект IOptionItem в форму
                setValueToForm({ value: value, key: items[options.indexOf(value?.toLocaleUpperCase().trim())].key, ...items[options.indexOf(value?.toLocaleUpperCase().trim())]});    
            }
        }
    }

    /** Проставка выбранного значения в поле
     * @param value строковое значение для проставки в поле
     * @param option объект {key, value, label(аналогичен value)}
     */
    let onSelect = (value: any, option: any) => {
        setCurrentValue(option?.item);
        setValueToForm(option?.item);
        if (value) {
            loadItemById(value?.trim() ?? ''); 
        }
        if (props.onChange) {
            props.onChange(option?.item);
        }
        setIsOpen(false)
        if (focusRef?.current && focusRef?.current?.blur) {
            focusRef?.current?.blur();
        }
    }

    /** событие по потере фокуса */
    let onBlur = () => {
        setIsOpen(false);
    }

    return (
        <Spin spinning={isLoading}>
            <div style={{display: "flex"}}>
                <RcSelect ref={focusRef}
                    required={props.required}
                    showSearch={props.manualInputAllowed !== undefined && props.manualInputAllowed !== null ? props.manualInputAllowed : true }
                    value={currentValue?.value}
                    notFoundContent={props.notFoundContent}
                    onSearch={handleSearch}
                    onFocus={onFocus}
                    onClear={onClear}
                    onSelect={onSelect}
                    delay={DEFAULT_SEARCH_DELAY_MS_VALUE}
                    open={isOpen}
                    onBlur={onBlur}
                    allowClear={true}
                    filterOption={false}
                    defaultActiveFirstOption={isSingleElem}
                >
                    {getOptionList()}
                </RcSelect>
                {props.onButtonClick && <Button onClick={props.onButtonClick}>
                    <DirectoryBookIcon />
                </Button>}
            </div>
        </Spin>
    );

    // Получить список элементов для отрисовки
    function getOptionList(): ReactNode | ReactNode[] {
        if (showInfo) {
            return [<RcSelect.Option key={INFO_ELEM_KEY_VALUE} value={INFO_ELEM_KEY_VALUE} disabled style={{cursor: INFO_ELEM_CURSOR_VALUE}}>{INFO_ELEM_TEXT_VALUE}</RcSelect.Option>,
                ...items.map((item: IOptionItem) => {
                    return <RcSelect.Option 
                                key={`${item?.key}`} 
                                value={item?.value ?? `${item?.key}`}
                                disabled={item?.disabled}
                                item={item}
                                style={item?.disabled ? {color: DISABLED_ELEM_COLOR_VALUE} : item?.isSpecific ? {color: SPECIFIC_ELEM_COLOR_VALUE} : {}}
                                >
                                    {item?.value ?? `${item?.key}`}
                            </RcSelect.Option>
            })]
        } 
        else {
            return items.map((item: IOptionItem) => {
                return <RcSelect.Option 
                            key={`${item?.key}`} 
                            value={item?.value ?? `${item?.key}`}
                            disabled={item?.disabled}
                            item={item}
                            style={item?.disabled ? {color: DISABLED_ELEM_COLOR_VALUE} : item?.isSpecific ? {color: SPECIFIC_ELEM_COLOR_VALUE} : {}}
                            >
                                {item?.value ?? `${item?.key}`}
                        </RcSelect.Option>
            })
        }
    }

    /** получить информационный текст */
    function getInfoText(): string {
        if (props.resultInfoText) {
            // переданный текст
            return props.resultInfoText;
        }
        else {
            // предустановленный текст
            if (props.dataService?.resultsAmount !== null && props.dataService?.resultsAmount !== undefined) {
                return `Отображены первые ${props.dataService?.resultsAmount - 1} элементов`;
            }
            else {
                return `Отображены все результаты`;
            }
        }
    }

    /**
     * Проставляет значение в форму.
     * @param value Значение для простановки в форму.
     */
    function setValueToForm(value?: IOptionItem): boolean {
        if (props.ctx) {
            props.ctx.setFieldValue(props.fieldName, value);
            return true;
        }
        return false;
    }
});