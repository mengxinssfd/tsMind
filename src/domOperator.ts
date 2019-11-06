let elementStyle = document.createElement('div').style;
let vendor = (() => {
    let transformName = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform'
    };

    for (let key in transformName) {
        if (elementStyle[transformName[key]] !== undefined) {
            return key;
        }
    }
    return false;
})();

interface DomOptions {
    tagName: string,
    content?: string,
    style?: any,
    attr?: any,
    on?: {
        [key: string]: {
            catch?: boolean,
            handler: (e: Event) => boolean | void
        } | ((e: Event) => boolean | void)
    }
}

export class DomOperator {
    static createElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
    }

    static createEl(options: DomOptions): HTMLElement {
        const dom = document.createElement(options.tagName);
        if (options.content) dom.innerText = options.content;
        // 样式
        for (let styleType in options.style) {
            if (!options.style.hasOwnProperty(styleType)) continue;
            const style = options.style[styleType];
            if (!style) continue;
            dom.style[styleType] = style;
        }

        // 属性
        for (let key in options.attr) {
            if (!options.attr.hasOwnProperty(key)) continue;
            const value = options.attr[key];
            if (!key || [NaN, "", null, undefined].includes(value)) continue;
            dom.setAttribute(key, value);
        }

        // 事件
        for (let event in options.on) {
            const value = options.on[event];
            if (!value) continue;
            if (typeof value === "function") {
                dom.addEventListener(event, value);
            } else {
                dom.addEventListener(event, value.handler, value.catch);
            }

        }
        return dom;
    }

    static isDom = (typeof HTMLElement === 'object') ?
        function (target): boolean {
            return target instanceof HTMLElement;
        } :
        function (target): boolean {
            return target && typeof target === 'object' && target.nodeType === 1 && typeof target.nodeName === 'string';
        };

    static addClass = !!document.documentElement.classList ? function (target: HTMLElement, className: string | string[]) {
        target.classList.add(...Array.isArray(className) ? className : [className]);
        return target.className;
    } : function (target: HTMLElement, className: string | string[]) {
        const originClass = target.className;
        const originClassArr = originClass.split(" ");

        className = Array.isArray(className) ? className : [className];
        className = [...new Set(className)];
        className = className.filter(cname => !originClassArr.includes(cname));
        if (!className.length) return originClass;
        className = className.join(" ");

        target.className = !!originClass ? originClass + " " + className : className;
        return target.className;
    };

    static removeClass(dom: HTMLElement, className: string): string {
        if (dom.classList) {
            dom.classList.remove(className);
        } else {
            dom.className = dom.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)', "gi"), "");
        }
        return dom.className;
    }

    /**
     * 判断是什么种类的浏览器并返回拼接前缀后的数据
     * @param style
     * @returns {*}
     */
    static prefixStyle(style: string): string {
        if (vendor === false || vendor === 'transform') {
            return style;
        }
        return vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }
}