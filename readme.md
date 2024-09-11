

js 算术表达式解释执行。

支持小括号，加`+`, 减`-`, 乘 `*`, 除 `/`。


### 用法

```js
try {
    console.log(express.exec("1+2+3"))
    console.log(express.exec("1+2*3+4"))
    console.log(express.exec("1+2*(3+4)"))
} catch(e) {
    console.log("语法错误:", e)
}
```


### 编译


```
npm run build
```

### 测试

```
npm t
```
