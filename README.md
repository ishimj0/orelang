# orelang

orelang is a simple programming language in JSON. (JSONで記述するシンプルなプログラミング言語、orelang)

## sample

```sh
cd demo
deno run -A ../ore.js ./simple_geo3x3.orelang
```

## usage

```JavaScript
import { orelang } from "https://code4fukui.github.io/orelang/orelang.js";

await orelang.run(["call", "https://code4fukui.github.io/orelang/demo/sum.orelang", 10, 20]);
```

## supported features

- `+`, `-`, `*`, `/`, `%`, `=`, `>`, `<`, `<=`, `>=`, `&&`, `||`, `!`
  - `[op, expression1, expression2]`
  - operators.
- `step`
  - `["step", expression, ...]`
  - evaluates all given expressions.
  - returns result of evaluation on last expression.
    - novalue is not counted as "last expression".
    - if there's no valid expression evaluation in steps, it will return novalue.
- `set`
  - `["set", "identifier", expression]`
  - variable named identifier will be initialized with value expression. overwrite is allowed.
  - returns evaluated value of expression
- `get`
  - `["get", "identifier"]`
  - retrieves value of variable with the identifier.
- `if`
  - `["if", cond, on_true, on_false]`
- `while`
  - `["while", condition, expression]`
  - evaluates expression while condition is true.
  - returns result of evaluation on last expression.
    - novalue is not counted as "last expression".
    - if there's no valid expression evaluation in while loop, it will return novalue.
- `until`
  - `["until", condition, expression]`
  - evaluates expression until condition is false.
  - returns result of evaluation on last expression.
    - novalue is not counted as "last expression".
    - if there's no valid expression evaluation in while loop, it will return novalue.
- `break`
- `func`
  - `["func", "identifier", expression]`
- `return`
- `call`
  - `["call", "identifier", expression, ...]`
- `import`
  - `["import", "URL or path"]`
- `print`
- `push`
- `pop`

### String

- `String.charAt`
- `String.indexOf`
- `String.length`
- `String.parseInt`
- `String.parseFloat`

### Math

- `Math.floor`

### Array

- `Array`
- `Array.length`
- `Array.getAt`
- `Array.setAt`

## reference

- [orelang](https://qiita.com/shuetsu@github/items/ac21e597265d6bb906dc)

## hoge
