const jp = require('jsonpath');
export default class {
    
    private static propertyRegex = /(\$\.)(.*?)(?=')/gi;
    private static arrayRegex = /(\$)(\.(.*?))?(\.\.)(.*?)(?=')/gi; 
    static parseTemplate(data:object, template:object){
        return this.recObj(data, template);
    }

    private static evalData(_template, _prop, _data){
        let res = this.propertyRegex.exec(_template[_prop]);
        let mat = [];
        while(res !== null) {
            mat.push(res[0]);
            res = this.propertyRegex.exec(_template[_prop]);
        }
        mat.forEach(m=>{
            let query = jp.query(_data, m);
            if(query.length > 0)
                _template[_prop] = _template[_prop].replace("'" + m + "'", query[0]);
        });
    }
   
    private static recObj(data, template, clone=false) {
        let o;
        if(clone === true) 
            o = Object.assign({}, template); 
        else
            o = template;
        Object.keys(o).forEach(element => {
            var a;
            if((a = this.arrayRegex.exec(element)) && Array.isArray(o[element]) && typeof(o[element][0]) === "string" && typeof(o[element][1]) === "object") {
                let query = jp.query(data, a[0]);
                if(query.length > 0){
                    o[o[element][0]] = query.map(d => this.recObj(d, o[element][1], true));
                    delete o[element];
                }
            }
            if(typeof(o[element]) === "object" && Array.isArray(o[element]) !== true)
                this.recObj(data, o[element]);
            else if(Array.isArray(o[element]) === true) {
                for(let i=0;i<o[element].length;i++) {
                    if(typeof(o[element][i]) === "string")
                        this.evalData(o[element], i, data);
                    if(typeof(o[element][i]) === "object")
                        this.recObj(data, o[element][i]);
                }
            }
            else 
                if(typeof(o[element])==="string")
                    this.evalData(o, element, data);
        });
        return o;
    }
}