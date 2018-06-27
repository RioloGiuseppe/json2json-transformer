var render = require('../build/index');

var template = {
    literalProperty: "Constant",
    "'$.propertyName'": "Constant 2",
    simpleProperty: "'$.propertyDemo1'",
    composeProperty: "Two strings '$.propertyDemo1''$.propertyDemo2' and a number '$.mumberValue'",
    deepProperty: "'$.complexObject.nestedProperty'",
    complexObject: {
        nestedProperty: "'$.data2' valorized with other data",
        "'$.nestedPropertyName'": "'$.data2' valorized with other data"
    },
    arrayProperty: [
        "literal in array",
        "'$.stringInArray'",
        {
            ObjectInArray: "'$.inArray'"
        }
    ],
    "'$..values'": ["repeatedTemplate", {
        repeatedSimpleProp: "'$.val'"
    }]
}

var data1 = {
    propertyDemo1: "some value",
    propertyDemo2: "other value",
    complexObject: {
        nestedProperty: "deep",
    },
    inArray: "Inside an object in array!",
    stringInArray: "Inside an object in array!",
    mumberValue: 5000,
}

var data2 = {
    data2: "more data",
    values: [{
        val: 0
    }]
}

var data3 = {
    propertyName: "A property",
    nestedPropertyName: "Nested Property Name"
}


let step1 = render.parseTemplate(data1, template, { clone: true });
let step2 = render.parseTemplate(data2, step1, { clone: true });
let step3 = render.parseTemplate(data3, step2, {
    clone: true,
    transformProps: (s) => s.replace(/ /g, "-").toLowerCase()
});
console.log("template", JSON.stringify(template, null, 2));
console.log("step1", JSON.stringify(step1, null, 2));
console.log("step2", JSON.stringify(step2, null, 2));
console.log("step3", JSON.stringify(step3, null, 2));