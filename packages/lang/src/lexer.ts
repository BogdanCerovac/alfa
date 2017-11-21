export interface Token {
  readonly type: string
}

export class Stream {
  private readonly _input: string

  private _position: number = 0
  private _start: number = 0

  private _line: number = 0
  private _column: number = 0

  constructor (input: string) {
    this._input = input
  }

  get input () {
    return this._input
  }

  get position () {
    return this._position
  }

  get line () {
    return this._line
  }

  get column () {
    return this._column
  }

  public peek (offset: number = 0): string {
    return this._input.charAt(this._position + offset)
  }

  public advance (times: number = 1): boolean {
    let advanced = false

    do {
      if (this._position < this._input.length) {
        advanced = true

        if (isNewline(this.peek())) {
          this._line++
          this._column = 0
        } else {
          this._column++
        }

        this._position++
      }
    } while (--times > 0)

    return advanced
  }

  public next (): string {
    const next = this.peek()
    this.advance()
    return next
  }

  public ignore () {
    this._start = this._position
  }

  public restore (position: number) {
    this._position = position
    this._start = this._position
  }

  public accept (predicate: (char: string) => boolean): boolean {
    let accepted = false

    if (predicate(this.peek())) {
      do {
        if (!this.advance()) {
          break
        }
      } while (predicate(this.peek()))

      accepted = true
    }

    return accepted
  }

  public match (pattern: RegExp): boolean {
    const regex = new RegExp(pattern.source, 'y')

    regex.lastIndex = this._position

    if (regex.test(this._input) && regex.lastIndex !== this._position) {
      this._position = regex.lastIndex

      return true
    }

    return false
  }

  public value (): string {
    return this.input.substring(this._start, this._position)
  }

  public progressed (): boolean {
    return this._start !== this._position
  }
}

export type Pattern<T> = (stream: Stream) => T | void

export interface Lexer<T extends Token> extends Iterable<T> {}

export function * lex<T extends Token> (input: string, patterns: Array<Pattern<T>>): Iterator<T> {
  const stream = new Stream(input)

  outer: while (stream.position < input.length) {
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      const start = stream.position
      const token = pattern(stream)

      if (token) {
        stream.ignore()

        yield token
        continue outer
      }

      if (start !== stream.position) {
        stream.restore(start)
      }
    }

    throw new Error(`Unexpected token "${stream.peek()}"`)
  }
}

export function isBetween (char: string, lower: string, upper: string): boolean {
  return char >= lower && char <= upper
}

export function isWhitespace (char: string): boolean {
  return char === ' ' || char === '\t' || char === '\n'
}

export function isNewline (char: string): boolean {
  return char === '\n' || char === '\r' || char === '\f'
}

export function isAlpha (char: string): boolean {
  return isBetween(char, 'a', 'z') || isBetween(char, 'A', 'Z')
}

export function isNumeric (char: string): boolean {
  return isBetween(char, '0', '9')
}

export function isAlphanumeric (char: string): boolean {
  return isAlpha(char) || isNumeric(char)
}

export function isHex (char: string): boolean {
  return isNumeric(char) || isBetween(char, 'a', 'f') || isBetween(char, 'A', 'F')
}

export function isAscii (char: string): boolean {
  return char.charCodeAt(0) < 0x80
}

export function isNonAscii (char: string): boolean {
  return !isAscii(char)
}
