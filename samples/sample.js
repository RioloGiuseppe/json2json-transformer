var render = require('../build/index');

var template = {
    literalProperty: "Constant",
    simpleProperty : "'$.propertyDemo1'",
    composeProperty : "Two strings '$.propertyDemo1''$.propertyDemo2' and a number '$.mumberValue'",
    deepProperty : "'$.complexObject.nestedProperty'",
    complexObject : {
        nestedProperty: "'$.data2' valorized with other data"
    },
    arrayProperty: [
        "literal in array",
        "'$.stringInArray'",
        {
            ObjectInArray: "'$.inArray'"
        }
    ],
    "'$..values'":["repeatedTemplate", {
        repeatedSimpleProp:"'$.val'"
    }]
}

var data1 = {
    propertyDemo1: "some value",
    propertyDemo2: "other value",
    complexObject: {
        nestedProperty: "deep"
    },
    inArray: "Inside an object in array!",
    stringInArray: "Inside an object in array!",
    mumberValue:5000,
}

var data2 = {
    data2: "more data",
    values:[{
        val: 0
    }]
}


let step1 = render.parseTemplate(data1, template, true);
let step2 = render.parseTemplate(data2, step1, true);

console.log("template",JSON.stringify(template,null,2));
console.log("step1",JSON.stringify(step1,null,2));
console.log("step2",JSON.stringify(step2,null,2));