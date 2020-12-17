### 背景

主要目的是理解webpack的实现原理，这个小项目是为了了解webpack的整体架构。这篇文章是一个开头，后面计划陆续深入webpack的原理。

### 前置知识点

#### 模块化知识

参考文章：

- [前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.cn/post/6844903576309858318)
- [CommonJS、AMD/CMD、ES6 Modules](https://github.com/muwoo/blogs/issues/28)

具体内容可以看参考的两篇文档，这里简单总结一下：

- Node.js是`commonJS`规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module、exports、require、global`
- Node 在对 JS 文件进行编译的过程中，会对文件中的内容进行头尾包装 ，在头部添加`(function (export, require, modules, __filename, __dirname){\n` 在尾部添加了`\n};`

- commonJS用同步的方式加载模块，只有在代码执行到`require`的时候，才回去执行加载
- `es6 modules` 是一个编译时就会确定模块依赖关系的方式。

#### AST

AST是什么？

> 在计算机科学中，抽象语法树（abstract syntax tree 或者缩写为 AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码。树上的每个节点都表示源代码中的一种结构。之所以说语法是「抽象」的，是因为这里的语法并不会表示出真实语法中出现的每个细节。

可以在 [Esprima](https://esprima.org/demo/parse.html#) 这个网站试一下将代码转换成ast

### 进入正题，一个简单的webpack打包实现

#### 需求明确

首先明确一下这个简易打包做了什么事情？plugin 和 loader都没有，只做了以下简单的两件事情

- 代码转换 ES6 --> ES5
- 通过enty入口文件开始分析，最后打包进成配置好的output文件中

#### webpack打包

基本文件

index.js

```javascript
import a from './test'
console.log(a)
```

test.js

```javascript
import b from './message'
const a = 'hello' + b
export default a
```

message.js

```javascript
const b = 'world'
export default b
```

代码很简单，index.js 引用了 test.js，test.js引用了message.js

下面是webpack打包后的代码，webpack的版本 5.10.1

```javascript
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/
(() => { // webpackBootstrap
    /******/
    "use strict";
    /******/
    var __webpack_modules__ = ({

        /***/ "./src/index.js":
        /*!**********************!*\
          !*** ./src/index.js ***!
          \**********************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

            eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test */ \"./src/test.js\");\n\nconsole.log('index', _test__WEBPACK_IMPORTED_MODULE_0__.default)\n\n//# sourceURL=webpack://tinyWebpack/./src/index.js?");

            /***/
        }),

        /***/ "./src/message.js":
        /*!************************!*\
          !*** ./src/message.js ***!
          \************************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

            eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nconst b = 'world'\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (b);\n\n//# sourceURL=webpack://tinyWebpack/./src/message.js?");

            /***/
        }),

        /***/ "./src/test.js":
        /*!*********************!*\
          !*** ./src/test.js ***!
          \*********************/
        /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

            eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message */ \"./src/message.js\");\n\n\nconst a = 'hello' + _message__WEBPACK_IMPORTED_MODULE_0__.default\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (a);\n\n//# sourceURL=webpack://tinyWebpack/./src/test.js?");

            /***/
        })

        /******/
    });
    /************************************************************************/
    /******/ 	// The module cache
    /******/
    var __webpack_module_cache__ = {};
    /******/
    /******/ 	// The require function
    /* require 函数，通过文件找到对应的函数，然后执行 */
    /******/
    function __webpack_require__(moduleId) {
        /******/ 		// Check if module is in cache
        /******/
        if (__webpack_module_cache__[moduleId]) {
            /******/
            return __webpack_module_cache__[moduleId].exports;
            /******/
        }
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = __webpack_module_cache__[moduleId] = {
            /******/ 			// no module.id needed
            /******/ 			// no module.loaded needed
            /******/            exports: {}
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /************************************************************************/
    /******/
    /* webpack/runtime/define property getters */
    /******/
    (() => {
        /******/ 		// define getter functions for harmony exports
        /******/
        __webpack_require__.d = (exports, definition) => {
            /******/
            for (var key in definition) {
                /******/
                // 判断definition和exports两个变量上是否有 key属性
                // 例子，test.js中
                // __webpack_require__.d(__webpack_exports__, {
				//	"default": () => __WEBPACK_DEFAULT_EXPORT__
                // });
                if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                    /***
                    test.js 给__webpack_exports__增加属性 default，get方法就是返回__WEBPACK_DEFAULT_EXPORT__
                    ***/
                    Object.defineProperty(exports, key, {enumerable: true, get: definition[key]});
                    /******/
                }
                /******/
            }
            /******/
        };
        /******/
    })();
    /******/
    /******/
    /* webpack/runtime/hasOwnProperty shorthand */
    /* __webpack_require__.o是判断 obj中是否有属性props */
    /******/
    (() => {
        /******/
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
        /******/
    })();
    /******/
    /******/
    /* webpack/runtime/make namespace object */
    /******/
    (() => {
        /******/ 		// define __esModule on exports
        /******/
        __webpack_require__.r = (exports) => {
            /******/
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/
                Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'});
                /******/
            }
            /******/
            Object.defineProperty(exports, '__esModule', {value: true});
            /******/
        };
        /******/
    })();
    /******/
    /************************************************************************/
    /******/ 	// startup
    /******/ 	// Load entry module
    /******/
    __webpack_require__("./src/index.js");
    /******/ 	// This entry module used 'exports' so it can't be inlined
    /******/
})();
```

简单分析一下这个打包出来的结果，代码的整体结构是这个样子的

```javascript
(() => {
    var __webpack_modules__ = {
        "./src/index.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            // ...
        },
        "./src/test.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            // ...
        },
        "./src/message.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            // ...
        },
    }
    
    function __webpack_require__(moduleId) {
        // ...
    }
    
    (() => {
        __webpack_require__.d = (exports, definition) => {
            // ...
        }
    })()
    
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    })()
    
    (() => {
        __webpack_require__.r = (exports) => {
            // ...
        }
    })()
    
    __webpack_require__("./src/index.js");
})()
```

代码的结构很简单：

- 首先定义了`__webpack_modules__`变量，是一个 `路径 --> 函数`这样的key，value的键值对，而函数内部是我们定义的文件转移成 ES5 之后的代码，转换成可执行代码只后是这样的

    ```javascript
    // index.js
    __webpack_require__.r(__webpack_exports__); // 在__webpack_exports__上增加__esModule属性
    /* harmony import */ 
    // 通过import找到依赖文件，test.js 并通过__webpack_require__执行test.js文件
    // 因为没有exports所以不会执行__webpack_require__.d
    var _test__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./test */ "./src/test.js");
    
    console.log('index', _test__WEBPACK_IMPORTED_MODULE_0__.default)
    ```

    ```javascript
    // test.js
    __webpack_require__.r(__webpack_exports__);
    // __webpack_require__.d 函数：给__webpack_exports__属性增加default属性，值是__WEBPACK_DEFAULT_EXPORT__
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
    /* harmony export */ });
    /* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./message */ "./src/message.js");
    
    
    const a = 'hello' + _message__WEBPACK_IMPORTED_MODULE_0__.default
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (a);
    ```

    ```javascript
    // message.js
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
    /* harmony export */ });
    const b = 'world'
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (b);
    
    ```

- 接下来定义的 `__webpack_require__`方法，该方法，通过传入的` moduleId` 例如 `./src/index.js`在`__webpack_modules__`中通过键值对找到对应的函数，然后执行
- 在往后，是三个立即执行函数，定义了三个函数变量`__webpack_require__.d`，`__webpack_require__.o`，`__webpack_require__.r`
- 最后从入口文件开始执行 ` __webpack_require__("./src/index.js")`

#### 进入正题，自己的tinyWebpack

通过上面的调研，我们有哪些问题？

- 怎么将ES6转换为ES5
- 怎么拿到模块的加载依赖
- 如何生成一个可以在浏览器加载执行的js文件

**第一个问题，ES6 --> ES5**

- 首先讲ES6代码生成`ast`，这个过程有很多工具可以用例如：babylon  @babel/parser等等
- 然后将`ast`重新生成源码：这个过程也有工具可以使用：babel-core 还有其他的等等

```javascript
const parser = require("@babel/parser");
const {transformFromAst} = require('babel-core');

function getAst (filename) {
    const content = fs.readFileSync(filename, 'utf-8')

    // return babylon.parse(content, {
    //     sourceType: 'module',
    // });

    return parser.parse(content, {
        sourceType: 'module',
    })
}

function getTranslateCode(ast) {
    const {code} = transformFromAst(ast, null, {
        presets: ['env']
    });
    return code
}
```

**第二个问题，模块的加载依赖关系**

- 获取模块依赖关系：可以遍历`ast`视图，得到依赖关系，babel-traverse提供了这么一个功能，通过 `ImportDeclaration` 可以得到依赖属性

```javascript
const {transformFromAst} = require('babel-core');
function getTranslateCode(ast) {
    const {code} = transformFromAst(ast, null, {
        presets: ['env']
    });
    return code
}

function parse(fileName, entry) {
    let filePath = fileName.indexOf('.js') === -1 ? fileName + '.js' : fileName
    let dirName = entry ? '' : path.dirname(config.entry)

    let absolutePath = path.join(dirName, filePath)

    // 先将代码转换成ast，然后再转换成code，目的是 ES6 --> ES5
    // 获取该文件依赖的文件 getDependence(ast)
    const ast = getAst(absolutePath)
    return {
        fileName,
        dependence: getDependence(ast),
        code: getTranslateCode(ast),
    };
}
```

- 上面的代码只是获得一个文件的依赖关系，也只转换了一个文件的源码。因此，我们还需要做深度遍历

```javascript
/**
 * 获取深度队列依赖关系
 * @param main
 * @returns {*[]}
 * 传入index.js 发现index.js依赖test.js，push进去了test.js，继续遍历test.js的依赖，message.js
 * 于是拿到了完整的依赖关系树
 */
function getQueue(main) {
    let queue = [main]
    for (let asset of queue) {
        asset.dependence.forEach(function (dep) {
            let child = parse(dep)
            queue.push(child)
        })
    }
    return queue
}
```


