interface DomOptions {
    tagName: string;
    content?: string;
    style?: any;
    attr?: any;
    on?: {
        [key: string]: {
            catch?: boolean;
            handler: (e: Event) => boolean | void;
        } | ((e: Event) => boolean | void);
    };
}
export declare class DomOperator {
    static createElement(tagName: string): HTMLElement;
    static createEl(options: DomOptions): HTMLElement;
    static isDom: (target: any) => target is HTMLElement;
    static addClass: (target: HTMLElement, className: string | string[]) => string;
    static removeClass(dom: HTMLElement, className: string): string;
    /**
     * 判断是什么种类的浏览器并返回拼接前缀后的数据
     * @param style
     * @returns {*}
     */
    static prefixStyle(style: string): string;
}
export {};
