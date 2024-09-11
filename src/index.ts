class ExpressParser {
    exec(str: string): number {
        let tokens = this.parsing(str)
        let express = this.syntaxTree(tokens)
        if (express != null) {
            return express.cal();
        }
        throw new Error("表达式错误");
    }

    parsing(str: string): Token[] {
        let tokens: Token[] = [];
        let t: string = '';
        while (str.length > 0) {
            const element = str[0];
            str = str.substring(1);
            if (element.trim() == '') {
                continue
            }

            if (this.isNumeric(element)) {
                t += element;
            } else {
                if (t.length > 0) {
                    tokens.push(new Token('n', t));
                    t = '';
                }
                if (['+', '-', '*', '/'].indexOf(element) != -1) {
                    tokens.push(new Token('o', element));
                } else if (['('].indexOf(element) != -1) {
                    tokens.push(new Token('b1', element));
                } else if ([')'].indexOf(element) != -1) {
                    tokens.push(new Token('b2', element));
                } else {
                    throw new Error("非法字符")
                }
            }
        }
        if (t.length > 0) {
            tokens.push(new Token('n', t))
        }
        return tokens;
    }

    syntaxTree(tokens: Token[]): Express | null {
        let express: Express | null = null;
        let num1: number | Express | null = null;
        let num2: number | Express | null = null;
        let operator: string = '';
        let noperator: string = '';
        while (tokens.length > 0) {

            if (num1 == null) {
                if (tokens[0].tokenType == 'n') {
                    num1 = Number(tokens[0].tokenVal);
                    tokens = tokens.slice(1, tokens.length);
                } else if (tokens[0].tokenType == 'b1') {
                    let end = this.findRightBracket(tokens);
                    if (end == 0) {
                        throw new Error("括号不匹配");
                    }
                    num1 = this.syntaxTree(tokens.slice(1, end));
                    tokens = tokens.slice(end + 1, tokens.length);
                } else {
                    throw new Error("语法错误");
                }
            }

            if (operator == '') {
                if (tokens[0].tokenType == 'o') {
                    operator = tokens[0].tokenVal;
                    tokens = tokens.slice(1, tokens.length);
                } else {
                    throw new Error("语法错误");
                }
            }

            if (num2 == null) {
                if (tokens[0].tokenType == 'n') {
                    num2 = Number(tokens[0].tokenVal);
                    tokens = tokens.slice(1, tokens.length);
                } else if (tokens[0].tokenType == 'b1') {
                    let end = this.findRightBracket(tokens);
                    if (end == 0) {
                        throw new Error("括号不匹配");
                    }
                    num2 = this.syntaxTree(tokens.slice(1, end));
                    tokens = tokens.slice(end + 1, tokens.length);
                } else {
                    throw new Error("语法错误");
                }
            }

            if (tokens.length > 0) {
                if (tokens[0].tokenType != 'o') {
                    throw new Error("语法错误");
                }
                noperator = tokens[0].tokenVal;
                if (this.isFirst(noperator, operator)) {
                    tokens = tokens.slice(1, tokens.length);
                    if (tokens.length <= 0) {
                        throw new Error("语法错误");
                    }
                    let nnum: number | Express | null;
                    if (tokens[0].tokenType == 'n') {
                        nnum = Number(tokens[0].tokenVal);
                        tokens = tokens.slice(1, tokens.length);
                    } else if (tokens[0].tokenType == 'b1') {
                        let end = this.findRightBracket(tokens);
                        if (end == 0) {
                            throw new Error("括号不匹配");
                        }
                        nnum = this.syntaxTree(tokens.slice(1, end));
                        tokens = tokens.slice(end + 1, tokens.length);
                    } else {
                        throw new Error("语法错误");
                    }
                    num2 = new Express(num2, nnum, noperator);
                } else {
                    num1 = new Express(num1, num2, operator);
                    operator = '';
                    num2 = null;
                }
            }
        }

        if (num1 != null && num2 != null) {
            express = new Express(num1, num2, operator);
        }

        if (express == null && num1 != null && num1 instanceof Express) {
            return num1;
        }
        if (express == null && num2 != null && num2 instanceof Express) {
            return num2;
        }
        return express;
    }

    isNumeric(str: string): boolean {
        return /^\d|\.$/.test(str);
    }

    findRightBracket(tokens: Token[]): number {
        let count = 0;
        for (let i = 1; i < tokens.length; i++) {
            if (tokens[i].tokenType == "b2") {
                if (count == 0) {
                    return i;
                } else {
                    count--;
                }
            }
            if (tokens[i].tokenType == "b1") {
                count++;
            }
        }
        return 0;
    }

    isFirst(o1: string, o2: string): boolean {
        if (o1 == '*' || o1 == '/') {
            if (o2 == '+' || o2 == '-') {
                return true;
            }
        }
        return false;
    }
}

class Token {
    tokenType: string;
    tokenVal: string;
    constructor(tokenType: string, tokenVal: string) {
        this.tokenVal = tokenVal
        this.tokenType = tokenType
    }
}

class Express {
    num1: number | Express | null;
    num2: number | Express | null;
    operator: string;
    constructor(num1: number | Express | null, num2: number | Express | null, operator: string) {
        this.num1 = num1
        this.num2 = num2
        this.operator = operator
    }

    cal(): number {
        if (this.num1 == null || this.num2 == null) {
            throw new Error("表达式错误");
        }
        let n1: number = 0;
        let n2: number = 0;
        if (this.num1 instanceof Express) {
            n1 = this.num1.cal();
        } else {
            n1 = this.num1;
        }
        if (this.num2 instanceof Express) {
            n2 = this.num2.cal();
        } else {
            n2 = this.num2;
        }

        switch (this.operator) {
            case '+':
                return n1 + n2;
            case '-':
                return n1 - n2;
            case '*':
                return n1 * n2;
            case '/':
                return n1 / n2;
            default:
                throw new Error("操作符不支持");
        }
    }
}

export default new ExpressParser()
