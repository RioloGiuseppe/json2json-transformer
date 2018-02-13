"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jp = require('jsonpath');
var lodash_1 = require("lodash");
var JsonTransform = /** @class */ (function () {
    function JsonTransform() {
    }
    JsonTransform.parseTemplate = function (data, template, ignore, cloneTemplate) {
        if (ignore === void 0) { ignore = null; }
        if (cloneTemplate === void 0) { cloneTemplate = true; }
        return this.recObj(data, template, ignore, cloneTemplate);
    };
    JsonTransform.evalData = function (_template, _prop, _data, ignore) {
        var res = this.propertyRegex.exec(_template[_prop]);
        var mat = [];
        while (res !== null) {
            mat.push(res[0]);
            res = this.propertyRegex.exec(_template[_prop]);
        }
        mat.forEach(function (m) {
            var query = jp.query(_data, m);
            if (query.length = 1)
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
    JsonTransform.recObj = function (data, template, ignore, clone) {
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
            var a;
            if ((a = _this.arrayRegex.exec(element)) && Array.isArray(o[element]) && typeof (o[element][0]) === "string" && typeof (o[element][1]) === "object") {
                var query = jp.query(data, a[0]);
                if (query.length > 0) {
                    if (typeof query[0] === "string" && ignore !== "" && query[0] === ignore) {
                        delete o[element];
                    }
                    else {
                        o[o[element][0]] = query[0].map(function (d) { return _this.recObj(d, o[element][1], ignore, true); });
                        delete o[element];
                    }
                }
            }
            if (typeof (o[element]) === "object" && Array.isArray(o[element]) !== true)
                _this.recObj(data, o[element], ignore, false);
            else if (Array.isArray(o[element]) === true) {
                for (var i = 0; i < o[element].length; i++) {
                    if (typeof (o[element][i]) === "string")
                        _this.evalData(o[element], i, data, ignore);
                    if (typeof (o[element][i]) === "object")
                        _this.recObj(data, o[element][i], ignore, false);
                }
            }
            else if (typeof (o[element]) === "string")
                _this.evalData(o, element, data, ignore);
        });
        return o;
    };
    JsonTransform.propertyRegex = /(\$\.)(.*?)(?=')/gi;
    JsonTransform.arrayRegex = /(\$)(\.(.*?))?(\.\.)(.*?)(?=')/gi;
    return JsonTransform;
}());
function parseTemplate(data, template, ignore, cloneTemplate) {
    if (ignore === void 0) { ignore = null; }
    if (cloneTemplate === void 0) { cloneTemplate = true; }
    return JsonTransform.parseTemplate(data, template, ignore, cloneTemplate);
}
exports.parseTemplate = parseTemplate;
//# sourceMappingURL=index.js.map