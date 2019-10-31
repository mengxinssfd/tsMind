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
    type: string,
    content?: string,
    style?: any,
    attr?: any,
    on?: {
        [key: string]: {
            catch?: boolean,
            handler: () => boolean
        } | (() => boolean)
    }
}

export class DomOperator {
    static createElement(nodeName: string): any {
        return document.createElement(nodeName);
    }

    static createEl(options: DomOptions): any {
        const dom = document.createElement(options.type);
        if (options.content) dom.innerText = options.content;
        // 样式
        for (let styleType in options.style) {
            const style = options.style[styleType];
            if (!style) continue;
            dom.style[DomOperator.prefixStyle(styleType)] = style;
        }

        // 属性
        for (let key in options.attr) {
            const value = options.attr[key];
            if (!key) continue;
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

    static addClass = !!document.documentElement.classList ? function (target: any, className: string | string[]) {
        target.classList.add(...Array.isArray(className) ? className : [className]);
        return target.className;
    } : function (target: any, className: string | string[]) {
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

    static removeClass(dom: any, className: string): string {
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