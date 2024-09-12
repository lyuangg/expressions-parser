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

                if (t.length <= 0 && element == '-') {
                    t = element;
                    continue;
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
        let stack: any[] = [];
        let haveFirstOperator: boolean = false;
        let expressItem: number | Express | string | null = '';
        while (tokens.length > 0) {
            const item = tokens.shift()
            if (item?.tokenType == 'b1') {
                const end = this.findRightBracket(tokens)
                if (end <= 0) {
                    throw new Error("括号不匹配")
                }
                expressItem = this.syntaxTree(tokens.slice(0, end));
                tokens = tokens.slice(end + 1, tokens.length);
            } else if (item?.tokenType == 'o') {
                expressItem = item.tokenVal;
                if (item.tokenVal == '*' || item.tokenVal == '/') {
                    haveFirstOperator = true;
                } else {
                    haveFirstOperator = false;
                }
            } else if (item?.tokenType == 'n') {
                expressItem = Number(item.tokenVal);
            } else {
                throw new Error("表达式错误");
            }

            stack.push(expressItem);
            if (stack.length >= 3 && haveFirstOperator && item.tokenType != 'o') {
                const n2 = stack.pop()
                const o = stack.pop()
                const n1 = stack.pop()
                const newItem = new Express(n1, n2, o);
                stack.push(newItem);
            }
        }

        let ep: number | Express | null = null;
        let o: string = '';
        while (stack.length > 0) {
            const item = stack.shift();
            if (typeof item == 'number' || item instanceof Express) {
                if (ep == null) {
                    ep = item;
                } else if (o != '') {
                    ep = new Express(ep, item, o);
                    o = '';
                } else {
                    throw new Error("语法错误");
                }
            } else {
                o = item;
            }
        }

        if (ep != null && ep instanceof Express) {
            return ep;
        }
        return null;
    }

    isNumeric(str: string): boolean {
        return /^\d|\.$/.test(str);
    }

    findRightBracket(tokens: Token[]): number {
        let count = 0;
        for (let i = 0; i < tokens.length; i++) {
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
