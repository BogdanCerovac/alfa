/**
 * @see https://en.wikipedia.org/wiki/List_of_Unicode_characters
 */
export enum Char {
  // Control codes
  Null = 0x00,
  StartOfHeading = 0x01,
  StartOfText = 0x02,
  EndOfText = 0x03,
  EndOfTransmission = 0x04,
  Enquiry = 0x05,
  Acknowledge = 0x06,
  Bell = 0x07,
  Backspace = 0x08,
  CharacterTabulation = 0x09,
  LineFeed = 0x0a,
  LineTabulation = 0x0b,
  FormFeed = 0x0c,
  CarriageReturn = 0x0d,
  ShiftOut = 0x0e,
  ShiftIn = 0x0f,
  DataLinkEscape = 0x10,
  DeviceControlOne = 0x11,
  DeviceControlTwo = 0x12,
  DeviceControlThree = 0x13,
  DeviceControlFour = 0x14,
  NegativeAcknowledge = 0x15,
  SynchronousIdle = 0x16,
  EndOfTransmissionBlock = 0x17,
  Cancel = 0x18,
  EndOfMedium = 0x19,
  Substitute = 0x1a,
  Escape = 0x1b,
  FileSeparator = 0x1c,
  GroupSeparator = 0x1d,
  RecordSeparator = 0x1e,
  UnitSeparator = 0x1f,

  // Punctuation and symbols
  Space = 0x20,
  ExclamationMark = 0x21,
  QuotationMark = 0x22,
  NumberSign = 0x23,
  DollarSign = 0x24,
  PercentSign = 0x25,
  Ampersand = 0x26,
  Apostrophe = 0x27,
  LeftParenthesis = 0x28,
  RightParenthesis = 0x29,
  Asterisk = 0x2a,
  PlusSign = 0x2b,
  Comma = 0x2c,
  HyphenMinus = 0x2d,
  FullStop = 0x2e,
  Solidus = 0x2f,

  // Digits
  DigitZero = 0x30,
  DigitOne = 0x31,
  DigitTwo = 0x32,
  DigitThree = 0x33,
  DigitFour = 0x34,
  DigitFive = 0x35,
  DigitSix = 0x36,
  DigitSeven = 0x37,
  DigitEight = 0x38,
  DigitNine = 0x39,

  // Punctuation and symbols
  Colon = 0x3a,
  Semicolon = 0x3b,
  LessThanSign = 0x3c,
  EqualSign = 0x3d,
  GreaterThanSign = 0x3e,
  QuestionMark = 0x3f,
  AtSign = 0x40,

  // Upper-case alphabet
  CapitalLetterA = 0x41,
  CapitalLetterB = 0x42,
  CapitalLetterC = 0x43,
  CapitalLetterD = 0x44,
  CapitalLetterE = 0x45,
  CapitalLetterF = 0x46,
  CapitalLetterG = 0x47,
  CapitalLetterH = 0x48,
  CapitalLetterI = 0x49,
  CapitalLetterJ = 0x4a,
  CapitalLetterK = 0x4b,
  CapitalLetterL = 0x4c,
  CapitalLetterM = 0x4d,
  CapitalLetterN = 0x4e,
  CapitalLetterO = 0x4f,
  CapitalLetterP = 0x50,
  CapitalLetterQ = 0x51,
  CapitalLetterR = 0x52,
  CapitalLetterS = 0x53,
  CapitalLetterT = 0x54,
  CapitalLetterU = 0x55,
  CapitalLetterV = 0x56,
  CapitalLetterW = 0x57,
  CapitalLetterX = 0x58,
  CapitalLetterY = 0x59,
  CapitalLetterZ = 0x5a,

  // Punctuation and symbols
  LeftSquareBracket = 0x5b,
  ReverseSolidus = 0x5c,
  RightSquareBracket = 0x5d,
  CircumflexAccent = 0x5e,
  LowLine = 0x5f,
  GraveAccent = 0x60,

  // Lower-case alphabet
  SmallLetterA = 0x61,
  SmallLetterB = 0x62,
  SmallLetterC = 0x63,
  SmallLetterD = 0x64,
  SmallLetterE = 0x65,
  SmallLetterF = 0x66,
  SmallLetterG = 0x67,
  SmallLetterH = 0x68,
  SmallLetterI = 0x69,
  SmallLetterJ = 0x6a,
  SmallLetterK = 0x6b,
  SmallLetterL = 0x6c,
  SmallLetterM = 0x6d,
  SmallLetterN = 0x6e,
  SmallLetterO = 0x6f,
  SmallLetterP = 0x70,
  SmallLetterQ = 0x71,
  SmallLetterR = 0x72,
  SmallLetterS = 0x73,
  SmallLetterT = 0x74,
  SmallLetterU = 0x75,
  SmallLetterV = 0x76,
  SmallLetterW = 0x77,
  SmallLetterX = 0x78,
  SmallLetterY = 0x79,
  SmallLetterZ = 0x7a,

  // Punctuation and symbols
  LeftCurlyBracket = 0x7b,
  VerticalLine = 0x7c,
  RightCurlyBracket = 0x7d,
  Tilde = 0x7e,

  // Control codes
  Delete = 0x7f
}
