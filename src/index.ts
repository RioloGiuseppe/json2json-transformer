const jp = require('jsonpath');
import { cloneDeep } from 'lodash'
import { type } from 'os';
class JsonTransform {

    private static propertyRegexPattern = "((\\$\\.)|(\\$\\[[0-9]+\\]))(.*?)(?=')"; // /((\$\.)|(\$\[[0-9]+\]))(.*?)(?=')/gi;
    private static arrayRegexPattern = "(\\$)(\\.(.*?))?(\\.\\.)(.*?)(?=')"; // /(\$)(\.(.*?))?(\.\.)(.*?)(?=')/gi; 

    static parseTemplate(data: object, template: object, ignore: string = null, cloneTemplate: boolean = true, tx: (s: string) => string) {
        return this.recObj(data, template, ignore, cloneTemplate, tx);
    }

    private static getJsonPathQuery(rawString: string): Array<string> {
        let regexpinstance = new RegExp(this.propertyRegexPattern, "gi");
        let res = regexpinstance.exec(rawString);
        let mat = [];
        while (res !== null) {
            mat.push(res[0]);
            res = regexpinstance.exec(rawString);
        }
        return mat;
    }

    private static evalData(_template: object, _prop: string | number, _data: object, ignore: string, transformProps: (s: string) => string) {
        let mat_r = this.getJsonPathQuery(_template[_prop]);
        let mat_l = this.getJsonPathQuery(_prop.toString());
        let prop = _prop;
        if (mat_l.length > 0) {
            mat_l.forEach(m => {
                let query = jp.query(_data, m);
                if (query.length > 0) {
                    let v = prop.toString().replace("'" + m + "'", "");
                    if (v !== "") {
                        _prop = prop.toString().replace("'" + m + "'", query[0]);
                    } else {
                        prop = query[0];
                    }
                }
            });
        }

        if (prop !== _prop) {
            let modProp = undefined;
            if (typeof transformProps === "function")
                modProp = transformProps(prop.toString());
            Object.defineProperty(_template, modProp || prop, Object.getOwnPropertyDescriptor(_template, _prop));
            delete _template[_prop];
            _prop = prop;
        }

        mat_r.forEach(m => {
            let query = jp.query(_data, m);
            if (query.length > 0) {
                let v = _template[_prop].replace("'" + m + "'", "");
                if (v !== "") {
                    _template[_prop] = _template[_prop].replace("'" + m + "'", query[0]);
                }
                else if (typeof ignore === "string" && ignore !== "" && query[0] === ignore) {
                    delete _template[_prop];
                } else {
                    _template[_prop] = query[0];
                }
            }

        });
    }

    private static recObj(data: object, template: object, ignore: string = null, clone: boolean = true, tx: (s: string) => string) {
        let o;
        if (!template || (typeof (template) !== "string" && typeof (template) !== "object"))
            return template;
        if (clone === true)
            o = cloneDeep(template);
        else
            o = template;
        Object.keys(o).forEach(element => {

            let regexpinstance = new RegExp(this.arrayRegexPattern, "gi");

            let a = regexpinstance.exec(element);

            if (a && Array.isArray(o[element]) && typeof (o[element][0]) === "string" && typeof (o[element][1]) === "object") {
                let query = jp.query(data, a[0]);
                if (query.length > 0) {
                    if (typeof query[0] === "string" && ignore !== "" && query[0] === ignore) {
                        delete o[element];
                    } else {
                        o[o[element][0]] = query[0].map(d => this.recObj(d, o[element][1], ignore, true, tx));
                        delete o[element];
                    }
                }
            }
            if (typeof (o[element]) === "object" && Array.isArray(o[element]) !== true)
                this.recObj(data, o[element], ignore, false, tx);
            else if (Array.isArray(o[element]) === true) {
                for (let i = 0; i < o[element].length; i++) {
                    if (typeof (o[element][i]) === "string")
                        this.evalData(o[element], i, data, ignore, tx);
                    if (typeof (o[element][i]) === "object")
                        this.recObj(data, o[element][i], ignore, false, tx);
                }
            }
            else
                if (typeof (o[element]) === "string")
                    this.evalData(o, element, data, ignore, tx);
        });
        return o;
    }
}

export function parseTemplate(data: object, template: object, options?: Options) {
    let ignore = (options !== undefined && options !== null) ? options.ignore : null;
    let clone = (options !== undefined && options !== null && typeof options.clone === "boolean") ? options.clone : true;
    let tx = (options !== undefined && options !== null && typeof options.transformProps === "function") ? options.transformProps : null;
    return JsonTransform.parseTemplate(data, template, ignore, clone, tx)
}

export interface Options {
    ignore: string;
    clone: boolean;
    transformProps: (s: string) => string;
}