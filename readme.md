

js 算术表达式解释执行。

- 支持小括号，加`+`, 减`-`, 乘 `*`, 除 `/` 等基本运算。
- 支持运算符优先级。


### 安装


```bash
npm i @lyuangg/expressions-parser
```

### 使用

```js
import express from "lyuangg-expressions-parser";

try {
    console.log(express.exec("1+2+3"))
    console.log(express.exec("1+2*3+4"))
    console.log(express.exec("1+2*(3+4)"))
} catch(e) {
    console.log("语法错误:", e)
}
```


### 编译


```bash
npm run build
```

### 测试

```bash
npm t
```
