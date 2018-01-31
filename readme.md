# json2json-transformer
> Transform a generic object using JSONPath.

Pulls data from a data object using JSONPath and generate a new objects based on a template. Each of the template's properties can pull properties from the source data or an array of all results found by its JSONPath. When pulling an array of data you can also supply a subtemplate to transform each item in the array.

JSONPath is like XPath for JavaScript objects. To learn the syntax, read the documentation for the [JSONPath](https://www.npmjs.org/package/JSONPath) package on npm and the [original article](http://goessner.net/articles/JsonPath/) by Stefan Goessner.

## Usage
Import reference in javascript
```js
const render = require('json2json-transformer');
```

Import reference in typescript
```ts
import * as render from 'json2json-transformer'
```

Define a template 

```js
let template = {
    literalProperty: "Constant",                                                                        // Constant string in template
    simpleProperty : "'$.propertyDemo1'",                                                               // Dynamic property (first level in data obj)
    composeProperty : "Two strings '$.propertyDemo1''$.propertyDemo2' and a number '$.mumberValue'",    // Computed propery thet mix strings and number
    deepProperty : "'$.complexObject.nestedProperty'",                                                  // Dynamic property (second level in data obj)
    complexObject : {                                                                                   // Complex object in template
        nestedProperty: "'$.data2' valorized with other data"                                           // This property is not present in first data obj
    },
    arrayProperty: [                                                                                    // Static array defined in template
        "literal in array",                                                                             // Static literal string in array
        "'$.stringInArray'",                                                                            // Dynamic string in array
        {                                                                                               
            ObjectInArray: "'$.inArray'"                                                                // Dynamic property inside an object in array
        }
    ],
    "'$..values'":                                                                                      // Dynamic array in template, path in data source
    ["repeatedTemplate",                                                                                // Property name in destination object
    {                                                                                                   // Array item template
        repeatedSimpleProp:"'$.val'"
    }]
}
```

Define object data
```js
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
    values:{
        val: 0
    }
}
```

Apply template

```js
// Apply data1 at template object. All un matched properties will be ignored
let step1 = render.parseTemplate(data1, template, true);

// Apply data2 at step1 output. All un matched properties will be ignored
let step2 = render.parseTemplate(data2, step1, true);

// Print output in console
console.log("template",JSON.stringify(template,null,2));
console.log("step1",JSON.stringify(step1,null,2));
console.log("step2",JSON.stringify(step2,null,2));
```
