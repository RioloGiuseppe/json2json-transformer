"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jp = require('jsonpath');
var lodash_1 = require("lodash");
var JsonTransform = /** @class */ (function () {
    function JsonTransform() {
    }
    JsonTransform.parseTemplate = function (data, template, ignore, cloneTemplate, tx) {
        if (ignore === void 0) { ignore = null; }
        if (cloneTemplate === void 0) { cloneTemplate = true; }
        return this.recObj(data, template, ignore, cloneTemplate, tx);
    };
    JsonTransform.getJsonPathQuery = function (rawString) {
        var regexpinstance = new RegExp(this.propertyRegexPattern, "gi");
        var res = regexpinstance.exec(rawString);
        var mat = [];
        while (res !== null) {
            mat.push(res[0]);
            res = regexpinstance.exec(rawString);
        }
        return mat;
    };
    JsonTransform.evalData = function (_template, _prop, _data, ignore, transformProps) {
        var mat_r = this.getJsonPathQuery(_template[_prop]);
        var mat_l = this.getJsonPathQuery(_prop.toString());
        var prop = _prop;
        if (mat_l.length > 0) {
            mat_l.forEach(function (m) {
                var query = jp.query(_data, m);
                if (query.length > 0) {
                    var v = prop.toString().replace("'" + m + "'", "");
                    if (v !== "") {
                        _prop = prop.toString().replace("'" + m + "'", query[0]);
                    }
                    else {
                        prop = query[0];
                    }
                }
            });
        }
        if (prop !== _prop) {
            var modProp = undefined;
            if (typeof transformProps === "function")
                modProp = transformProps(prop.toString());
            Object.defineProperty(_template, modProp || prop, Object.getOwnPropertyDescriptor(_template, _prop));
            delete _template[_prop];
            _prop = prop;
        }
        mat_r.forEach(function (m) {
            var query = jp.query(_data, m);
            if (query.length > 0) {
                var v = _template[_prop].replace("'" + m + "'", "");
                if (v !== "") {
                    _template[_prop] = _template[_prop].replace("'" + m + "'", query[0]);
                }
                else if (typeof ignore === "string" && ignore !== "" && query[0] === ignore) {
                    delete _template[_prop];
                }
                else {
                    _template[_prop] = query[0];
                }
            }
        });
    };
    JsonTransform.recObj = function (data, template, ignore, clone, tx) {
        var _this = this;
        if (ignore === void 0) { ignore = null; }
        if (clone === void 0) { clone = true; }
        var o;
        if (!template || (typeof (template) !== "string" && typeof (template) !== "object"))
            return template;
        if (clone === true)
            o = lodash_1.cloneDeep(template);
        else
            o = template;
        Object.keys(o).forEach(function (element) {
            var regexpinstance = new RegExp(_this.arrayRegexPattern, "gi");
            var a = regexpinstance.exec(element);
            if (a && Array.isArray(o[element]) && typeof (o[element][0]) === "string" && typeof (o[element][1]) === "object") {
                var query = jp.query(data, a[0]);
                if (query.length > 0) {
                    if (typeof query[0] === "string" && ignore !== "" && query[0] === ignore) {
                        delete o[element];
                    }
                    else {
                        o[o[element][0]] = query[0].map(function (d) { return _this.recObj(d, o[element][1], ignore, true, tx); });
                        delete o[element];
                    }
                }
            }
            if (typeof (o[element]) === "object" && Array.isArray(o[element]) !== true)
                _this.recObj(data, o[element], ignore, false, tx);
            else if (Array.isArray(o[element]) === true) {
                for (var i = 0; i < o[element].length; i++) {
                    if (typeof (o[element][i]) === "string")
                        _this.evalData(o[element], i, data, ignore, tx);
                    if (typeof (o[element][i]) === "object")
                        _this.recObj(data, o[element][i], ignore, false, tx);
                }
            }
            else if (typeof (o[element]) === "string")
                _this.evalData(o, element, data, ignore, tx);
        });
        return o;
    };
    JsonTransform.propertyRegexPattern = "((\\$\\.)|(\\$\\[[0-9]+\\]))(.*?)(?=')"; // /((\$\.)|(\$\[[0-9]+\]))(.*?)(?=')/gi;
    JsonTransform.arrayRegexPattern = "(\\$)(\\.(.*?))?(\\.\\.)(.*?)(?=')"; // /(\$)(\.(.*?))?(\.\.)(.*?)(?=')/gi; 
    return JsonTransform;
}());
function parseTemplate(data, template, options) {
    var ignore = (options !== undefined && options !== null) ? options.ignore : null;
    var clone = (options !== undefined && options !== null && typeof options.clone === "boolean") ? options.clone : true;
    var tx = (options !== undefined && options !== null && typeof options.transformProps === "function") ? options.transformProps : null;
    return JsonTransform.parseTemplate(data, template, ignore, clone, tx);
}
exports.parseTemplate = parseTemplate;
//# sourceMappingURL=index.js.map