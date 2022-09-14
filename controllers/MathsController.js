const path = require("path");
const fs = require("fs");

let operation;

module.exports = class MathsController extends require("./Controller") {
  constructor(HttpContext) {
    super(HttpContext);
  }

  error(message) {
    this.HttpContext.path.params.error = message;
  }

  doesExist(name) {
    if (name in this.HttpContext.path.params) {
      if (isNaN(this.HttpContext.path.params[name])) {
        this.error(`parameter ${name} is not a number`);
      }
    }
    if (this.HttpContext.path.params[name] == undefined) {
      this.error(`parameter  ${name} is missing`);
    }
  }

  checkParamsCount(nbParams) {
    if (Object.keys(this.HttpContext.path.params).length > nbParams) {
      return this.error("too many parameters");
    }
    return true;
  }

  get() {
    if (this.HttpContext.path.queryString == "?") {
      // Send helppage
      let helpPagePath = path.join(
        process.cwd(),
        "wwwroot/helpPages/mathsServiceHelp.html"
      );
      let content = fs.readFileSync(helpPagePath);
      this.HttpContext.response.content("text/html", content);
    } else {
      if (this.HttpContext.path.params.op) {
        operation = this.HttpContext.path.params.op;

        switch (operation) {
          case " ":
            this.doesExist("x");
            this.doesExist("y");
            if (this.checkParamsCount(3)) {
              this.HttpContext.path.params.value = Addition(
                this.HttpContext.path.params.x,
                this.HttpContext.path.params.y
              );
              this.HttpContext.path.params.op = "+";
            }

            break;
          case "-":
            this.doesExist("x");
            this.doesExist("y");
            if (this.checkParamsCount(3)) {
              this.HttpContext.path.params.value = Soustraction(
                this.HttpContext.path.params.x,
                this.HttpContext.path.params.y
              );
            }

            break;
          case "*":
            this.doesExist("x");
            this.doesExist("y");
            if (this.checkParamsCount(3)) {
              this.HttpContext.path.params.value = Multiplication(
                this.HttpContext.path.params.x,
                this.HttpContext.path.params.y
              );
            }

            break;
          case "/":
            this.doesExist("x");
            this.doesExist("y");
            if (this.checkParamsCount(3)) {
              this.HttpContext.path.params.value = Division(
                this.HttpContext.path.params.x,
                this.HttpContext.path.params.y
              );
            }

            break;
          case "%":
            this.doesExist("x");
            this.doesExist("y");
            if (this.checkParamsCount(3)) {
              this.HttpContext.path.params.value = Modulo(
                this.HttpContext.path.params.x,
                this.HttpContext.path.params.y
              );
            }

            break;

          case "!":
            this.doesExist("n");
            if (this.checkParamsCount(2)) {
              this.HttpContext.path.params.value = factorial(
                parseInt(this.HttpContext.path.params.n)
              );
            }

            break;

          case "p":
            this.doesExist("n");
            if (this.checkParamsCount(2)) {
              this.HttpContext.path.params.value = isPrime(
                parseInt(this.HttpContext.path.params.n)
              );
            }

            break;
          case "np":
            this.doesExist("n");
            if (this.checkParamsCount(2)) {
              this.HttpContext.path.params.value = findPrime(
                parseInt(this.HttpContext.path.params.n)
              );
            }

            break;

          default:
            this.error("This operation doesn't exist");

            break;
        }
      } else {
        this.error("parameter 'op' is missing");
      }

      this.HttpContext.response.JSON(this.HttpContext.path.params);
    }
  }
};

function Addition(x, y) {
  x = Number(x);
  y = Number(y);
  let value = x + y;
  return value;
}

function Soustraction(x, y) {
  x = Number(x);
  y = Number(y);
  let value = x - y;
  return value;
}

function Multiplication(x, y) {
  x = Number(x);
  y = Number(y);
  let value = x * y;
  return value;
}

function Division(x, y) {
  x = Number(x);
  y = Number(y);
  let value = x / y;
  if (isNaN(value)) {
    value = "NaN";
  }
  if (value === Infinity) {
    value = "Infinity";
  }
  return value;
}

function Modulo(x, y) {
  x = Number(x);
  y = Number(y);
  let value = x % y;
  if (isNaN(value)) {
    value = "NaN";
  }

  return value;
}

function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function isPrime(value) {
  for (var i = 2; i < value; i++) {
    if (value % i === 0) {
      return false;
    }
  }
  return value > 1;
}

function findPrime(n) {
  let primeNumer = 0;
  for (let i = 0; i < n; i++) {
    primeNumer++;
    while (!isPrime(primeNumer)) {
      primeNumer++;
    }
  }
  return primeNumer;
}
