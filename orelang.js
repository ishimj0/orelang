const fetchJSON = async (path) => {
  if (!path.startsWith("http://") && !path.startsWith("https://") && globalThis.Deno) {
    return JSON.parse(await Deno.readTextFile(path));
  }
  return await (await fetch(path)).json();
};

class Break {
  constructor(val) {
    this.val = val;
  }
}
class Return {
  constructor(val) {
    this.val = val;
  }
}

const ops = {};

const run = async (a) => {
  if (!Array.isArray(a)) {
    return a;
  }
  const name = await run(a[0]);
  const op = ops[name];
  if (op) {
    return await op(a);
  }
  throw new Error("not supported operator: " + name);
};

ops["+"] = async (ar) => {
  let n = await run(ar[1]);
  for (let i = 2; i < ar.length; i++) {
    n += await run(ar[i]);
  }
  return n;
};
ops["-"] = async (ar) => {
  let n = await run(ar[1]);
  for (let i = 2; i < ar.length; i++) {
    n -= await run(ar[i]);
  }
  return n;
};
ops["*"] = async (ar) => {
  let n = await run(ar[1]);
  for (let i = 2; i < ar.length; i++) {
    n *= await run(ar[i]);
  }
  return n;
};
ops["||"] = async (ar) => {
  let n = await run(ar[1]);
  for (let i = 2; i < ar.length; i++) {
    n ||= await run(ar[i]);
  }
  return n;
};
ops["&&"] = async (ar) => {
  let n = await run(ar[1]);
  for (let i = 2; i < ar.length; i++) {
    n &&= await run(ar[i]);
  }
  return n;
};
ops["/"] = async (ar) => await run(ar[1]) / await run(ar[2]);
ops["%"] = async (ar) => await run(ar[1]) % await run(ar[2]);
ops["="] = async (ar) => await run(ar[1]) === await run(ar[2]);
ops[">="] = async (ar) => await run(ar[1]) >= await run(ar[2]);
ops["<="] = async (ar) => await run(ar[1]) <= await run(ar[2]);
ops["<"] = async (ar) => await run(ar[1]) < await run(ar[2]);
ops[">"] = async (ar) => await run(ar[1]) > await run(ar[2]);
ops["!"] = async (ar) => !await run(ar[1]);

ops["step"] = async (ar) => {
  let n;
  for (let i = 1; i < ar.length; i++) {
    n = await run(ar[i]);
  }
  return n;
};
ops["until"] = async (ar) => {
  let n;
  try {
    while (!await run(ar[1])) {
      n = await run(ar[2]);
    }
  } catch (e) {
    if (e instanceof Break) {
      return e.val;
    } else {
      throw e;
    }
  }
  return n;
};
ops["while"] = async (ar) => {
  let n;
  try {
    while (await run(ar[1])) {
      n = await run(ar[2]);
    }
  } catch (e) {
    if (e instanceof Break) {
      return e.val;
    } else {
      throw e;
    }
  }
  return n;
};
ops["if"] = async (ar) => {
  if (await run(ar[1])) {
    return await run(ar[2]);
  } else {
    return await run(ar[3]);
  }
};

const varstack = [];
let vars = {};
ops["set"] = async (ar) => {
  const name = await run(ar[1]);
  const val = await run(ar[2]);
  vars[name] = val;
  //console.log("set", name, val)
  return val;
};
ops["get"] = async (ar) => {
  const name = await run(ar[1]);
  const val = vars[name];
  //console.log("get", name, val)
  return val;
};

ops["print"] = async (ar) => {
  let n;
  const res = [];
  for (let i = 1; i < ar.length; i++) {
    res.push(JSON.stringify(n = await run(ar[i])));
  }
  console.log(res.join(" "));
  return n;
};

const stack = [];
ops["push"] = async (ar) => {
  let n;
  for (let i = 1; i < ar.length; i++) {
    stack.push(n = await run(ar[i]));
  }
};
ops["pop"] = (_) => stack.pop();

const funcs = {};
ops["func"] = async (ar) => {
  const name = await run(ar[1]);
  const func = ar[2];
  funcs[name] = func;
};
ops["call"] = async (ar) => {
  varstack.push(vars);
  vars = {};
  const name = await run(ar[1]);
  for (let i = 2; i < ar.length; i++) {
    stack.push(await run(ar[i]));
  }
  const res = await (async () => {
    if (name.startsWith("http://") || name.startsWith("https://")  || name.startsWith("./")) {
      const func = await fetchJSON(name);
      return await run(func);
    }
    const func = funcs[name];
    if (!func) {
      throw new Error("can't find func:" + name);
    }
    try {
      return await run(func);
    } catch (e) {
      if (e instanceof Return) {
        return e.val;
      }
      throw e;
    }
  })();
  vars = varstack.pop();
  return res;
};
ops["return"] = async (ar) => {
  throw await run(ar[1]);
};
ops["import"] = async (ar) => {
  const name = await run(ar[1]);
  const url = ar[2];
  funcs[name] = await fetchJSON(url);
};

// Array
ops["Array"] = async (ar) => {
  const res = {};
  for (let i = 1; i < ar.length; i++) {
    res[i - 1] = await run(ar[i]);
  }
  return res;
};
ops["Array.length"] = async (ar) => Object.keys(await run(ar[1])).length;
ops["Array.getAt"] = async (ar) => (await run(ar[1]))[await run(ar[2])];
ops["Array.setAt"] = async (ar) => (await run(ar[1]))[await run(ar[2])] = await run(ar[3]);

// other functions
ops["Math.floor"] = async (ar) => Math.floor(await run(ar[1]));
ops["String.charAt"] = async (ar) => (await run(ar[1])).charAt(await run(ar[2]));
ops["String.indexOf"] = async (ar) => (await run(ar[1])).indexOf(await run(ar[2]));
ops["String.length"] = async (ar) => (await run(ar[1])).length;
ops["String.parseInt"] = async (ar) => parseInt(await run(ar[1]));
ops["String.parseFloat"] = async (ar) => parseFloat(await run(ar[1]));

export const orelang = { run };
