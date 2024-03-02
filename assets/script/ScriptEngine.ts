namespace Elk {
    export const enum JSValueType {
        NUMBER,
        STRING,
        BOOLEAN,
        ARRAY,
        OBJECT,
        NULL,
    }

    export type JSNumber = {
        t: JSValueType.NUMBER,
        value: number
    };

    export type JSString = {
        t: JSValueType.STRING,
        value: string
    };

    export type JSBoolean = {
        t: JSValueType.BOOLEAN,
        value: boolean
    };

    export type JSArray = {
        t: JSValueType.ARRAY,
        value: JSValue[]
    };

    export type JSObject = {
        t: JSValueType.OBJECT,
        value: object
    };

    export type JSNull = {
        t: JSValueType.NULL
    };

    export type JSValue = JSNumber | JSString | JSBoolean | JSArray | JSObject | JSNull;

    class JSValueUtil {
        static makeNumber(value: number): JSNumber {
            return {
                t: JSValueType.NUMBER,
                value: value
            };
        }

        static makeNull(): JSNull {
            return {
                t: JSValueType.NULL
            };
        }
    }

    export type ValueResult<T> = {
        win: true,
        value: T
    };

    export type ErrorResult = {
        win: false,
        error: string
    };

    export type Result<T> = ValueResult<T> | ErrorResult;

    class ResultUtil {
        static unwrap<T>(res: Result<T>): T {
            return (res as ValueResult<T>).value;
        }

        static makeValue(value: JSValue): ValueResult<JSValue> {
            return {
                win: true,
                value: value
            };
        }

        static makeError(error: string): ErrorResult {
            return {
                win: false,
                error: error
            };
        }
    }

    const enum Token {
        EOF,
        IDENTIFIER,
        NUMBER,
        STRING,
        SEMICOLON,
        LPAREN,
        RPAREN,
        LBRACE,
        RBRACE,

        BREAK,
        CASE,
        CATCH,
        CLASS,
        CONST,
        CONTINUE,
        DEFAULT,
        DELETE,
        DO,
        ELSE,
        FINALLY,
        FOR,
        FUNC,
        IF,
        IN,
        INSTANCEOF,
        LET,
        NEW,
        RETURN,
        SWITCH,
        THIS,
        THROW,
        TRY,
        VAR,
        VOID,
        WHILE,
        WITH,
        YIELD,
        UNDEF,
        NULL,
        TRUE,
        FALSE,

        DOT,
        CALL,
        POSTINC,
        POSTDEC,
        NOT,
        TILDA,
        TYPEOF,
        UPLUS,
        UMINUS,
        EXP,
        MUL,
        DIV,
        REM,
        PLUS,
        MINUS,
        SHL,
        SHR,
        ZSHR,
        LT,
        LE,
        GT,
        GE,
        EQ,
        NE,
        AND,
        XOR,
        OR,
        LAND,
        LOR,
        COLON,
        Q,
        ASSIGN,
        PLUS_ASSIGN,
        MINUS_ASSIGN,
        MUL_ASSIGN,
        DIV_ASSIGN,
        REM_ASSIGN,
        SHL_ASSIGN,
        SHR_ASSIGN,
        ZSHR_ASSIGN,
        AND_ASSIGN,
        XOR_ASSIGN,
        OR_ASSIGN,
        COMMA
    }

    export class Engine {
        token: Result<Token>;
        code: string;
        pos: number;
        tokenStart: number;
        tokenLength: number;
        numberValue: number;

        eval(str: string): Result<JSValue> {
            let res: Result<JSValue> = ResultUtil.makeValue(JSValueUtil.makeNull());

            this.code = str;
            this.pos = 0;

            for (; ;) {
                this.next();

                if (!this.token.win) {
                    return this.token as ErrorResult;
                }
                if (ResultUtil.unwrap(this.token) === Token.EOF) {
                    break;
                }

                res = this.statement();

                if (!res.win) {
                    return res;
                }
            }

            return res;
        }

        next() {

        }

        statement(): Result<JSValue> {
            let res: Result<JSValue>;

            switch (ResultUtil.unwrap(this.token)) {
                case Token.CASE:
                case Token.CATCH:
                case Token.CLASS:
                case Token.CONST:
                case Token.DEFAULT:
                case Token.DELETE:
                case Token.DO:
                case Token.FINALLY:
                case Token.IN:
                case Token.INSTANCEOF:
                case Token.NEW:
                case Token.SWITCH:
                case Token.THIS:
                case Token.THROW:
                case Token.TRY:
                case Token.VAR:
                case Token.VOID:
                case Token.WITH:
                case Token.WHILE:
                case Token.YIELD:
                    return ResultUtil.makeError(`${this.code.substring(this.tokenStart, this.tokenStart + this.tokenLength)} not implement`);
                    break;
                default:
                    this.resolve(this.expression());
                    if (ResultUtil.unwrap(this.token) !== Token.SEMICOLON) {
                        return ResultUtil.makeError("expect ;");
                    }
            }

            return res;
        }

        expression(): Result<JSValue> {
            return this.assignment();
        }

        assignment() {
            return this.ternary();
        }

        ternary() {
            return this.logicalOr();
        }

        logicalOr() {
            return this.logicalAnd();
        }

        logicalAnd() {
            return this.bitwiseOr();
        }

        bitwiseOr() {
            return this.bitwiseXor();
        }

        bitwiseXor() {
            return this.bitwiseAnd();
        }

        bitwiseAnd() {
            return this.equality();
        }

        equality() {
            return this.comparison();
        }

        comparison() {
            return this.shifts();
        }

        shifts() {
            return this.plusMinus();
        }

        plusMinus() {
            return this.mulDivRem();
        }

        mulDivRem() {
            return this.unary();
        }

        unary() {
            return this.postfix();
        }

        postfix() {
            return this.callDot();
        }

        callDot() {
            return this.group();
        }

        group() {
            return this.literal();
        }

        literal() {
            if (!this.token.win) {
                return ResultUtil.makeError("parse error");
            }
            switch (ResultUtil.unwrap(this.token)) {
                case Token.NUMBER:
                    return ResultUtil.makeValue(JSValueUtil.makeNumber(this.numberValue));
            }
        }
        
        resolve(value: Result<JSValue>) {

        }
    }
}

export {
    Elk
};