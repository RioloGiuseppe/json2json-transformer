"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jp = require('jsonpath');
var lodash_1 = require("lodash");
var JsonTransform = /** @class */ (function () {
    function JsonTransform() {
    }
    JsonTransform.parseTemplate = function (data, template, cloneTemplate) {
        if (cloneTemplate === void 0) { cloneTemplate = true; }
        return this.recObj(data, template, cloneTemplate);
    };
    JsonTransform.evalData = function (_template, _prop, _data) {
        var res = this.propertyRegex.exec(_template[_prop]);
        var mat = [];
        while (res !== null) {
            mat.push(res[0]);
            res = this.propertyRegex.exec(_template[_prop]);
        }
        mat.forEach(function (m) {
            var query = jp.query(_data, m);
            if (query.length > 0)
                _template[_prop] = _template[_prop].replace("'" + m + "'", query[0]);
        });
    };
    JsonTransform.recObj = function (data, template, clone) {
        var _this = this;
        if (clone === void 0) { clone = true; }
        var o;
        if (clone === true)
            o = lodash_1.cloneDeep(template);
        else
            o = template;
        Object.keys(o).forEach(function (element) {
            var a;
            if ((a = _this.arrayRegex.exec(element)) && Array.isArray(o[element]) && typeof (o[element][0]) === "string" && typeof (o[element][1]) === "object") {
                var query = jp.query(data, a[0]);
                if (query.length > 0) {
                    o[o[element][0]] = query[0].map(function (d) { return _this.recObj(d, o[element][1], true); });
                    delete o[element];
                }
            }
            if (typeof (o[element]) === "object" && Array.isArray(o[element]) !== true)
                _this.recObj(data, o[element], false);
            else if (Array.isArray(o[element]) === true) {
                for (var i = 0; i < o[element].length; i++) {
                    if (typeof (o[element][i]) === "string")
                        _this.evalData(o[element], i, data);
                    if (typeof (o[element][i]) === "object")
                        _this.recObj(data, o[element][i], false);
                }
            }
            else if (typeof (o[element]) === "string")
                _this.evalData(o, element, data);
        });
        return o;
    };
    JsonTransform.propertyRegex = /(\$\.)(.*?)(?=')/gi;
    JsonTransform.arrayRegex = /(\$)(\.(.*?))?(\.\.)(.*?)(?=')/gi;
    return JsonTransform;
}());
function parseTemplate(data, template, cloneTemplate) {
    if (cloneTemplate === void 0) { cloneTemplate = true; }
    return JsonTransform.parseTemplate(data, template, cloneTemplate);
}
exports.parseTemplate = parseTemplate;
//# sourceMappingURL=index.js.map