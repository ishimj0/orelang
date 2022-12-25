import { orelang } from "../orelang.js";

//console.log(await run(["+", 1, ["*", 5, 10], ["+", 10, 20]]));

const prog = ["step",
  ["set", "i", 10],
  ["set", "sum", 0],
  ["until", ["=", ["get", "i"], 0], [
    "step",
    ["set", "sum", ["+", ["get", "sum"], ["get", "i"]]],
    ["set", "i", ["+", ["get", "i"], -1]]
  ]],
  ["get", "sum"]
];
const prog1 = ["step",
["set", "sum", 0 ],
["set", "i", 1 ],
["while", ["<=", ["get", "i"], 10],
  ["step",
    ["set", "sum", ["+", ["get", "sum"], ["get", "i"]]],
    ["set", "i", ["+", ["get", "i"], 1]]]],
["print", ["get", "sum"]]];

const prog2 = ["if", 0, ["print", 1, 2, 3]];

const prog3 = [
  "step",
    ["func", "f", ["+", ["pop"], ["pop"]]],
    ["push", 10, 2],
    ["print", ["call", "f"]],
];
const prog4 = [
  "step",
    ["push", 1, 2, 3],
    ["print", ["pop"]],
    ["print", ["+", ["pop"], ["pop"]]],
];

const progerr = [
  "step",
    ["push", 1, 2, 3],
    ["print", ["pop"]] // なぜかエラーにならない！
    ["print", ["+", ["pop"], ["pop"]]],
];

const prog5 = [
  "step",
    ["import", "f", "http://127.0.0.1:62400/sum.orelang.json"],
    ["push", 10, 2],
    ["print", ["call", "f"]],
];
const prog6 = [
  "step",
    ["push", 10, 20],
    ["print", ["call", "http://127.0.0.1:62400/sum.orelang.json"]],
];
const prog7 = ["call", "http://127.0.0.1:62400/sum.orelang.json", 10, 100];

const prog8 = [ // local vars
  "step",
    ["func", "f", ["step",
      ["set", "a", 10],
      ["+", ["get", "a"], ["pop"]]
    ]],
    ["set", "a", 333],
    ["print", ["call", "f", 1]],
    ["print", ["get", "a"]]
];
const prog9 = [ // array
  "step",
    ["set", "a", ["Array", 1, 2, 3]],
    ["print", ["Array.length", ["get", "a"]]],
    ["print", ["Array.setAt", ["get", "a"], 0, 10]],
    ["print", ["Array.getAt", ["get", "a"], 0]],
    ["print", ["Array.getAt", ["get", "a"], 1]]
];

console.log(await orelang.run(prog9));
