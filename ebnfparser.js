//
//
//

var productions = {

    //[1]  grammar    ::= Rule+
    "grammar": {
        type: TERMS_SEQUENCE,
        terms: [ {type: TERM_NONTERMINAL, value: "Rule", quantifier: QUANTIFIER_PLUS} ]
    },

    //[2]  S          ::= (#x20 | #x9 | #xD | #xA)+
    "S": {
        type: TERMS_EXCEPTION,
        terms: [
            {type: TERM_CHARSET, value: /[\u0020\u0009\u000D\u000A]/, quantifier: QUANTIFIER_PLUS},
            {type: TERM_LITERAL, value: "\n\n"}
        ]
    },

    //[3]  Rule       ::= RuleNumber S Production S? "\n\n" S?
    "Rule": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "RuleNumber"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Production"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "\n\n"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK}
        ]
    },

    //[4]  RuleNumber ::= '[' [0-9]+ [a-zA-Z]* ']'
    "RuleNumber": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: '['},
            {type: TERM_CHARSET, value: /[0-9]/, quantifier: QUANTIFIER_PLUS},
            {type: TERM_CHARSET, value: /[a-zA-Z]/, quantifier: QUANTIFIER_STAR},
            {type: TERM_LITERAL, value: ']'}
        ]
    },

    //[5]  Production ::= Symbol S "::=" S Expression
    "Production": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Symbol"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_LITERAL, value: "::="},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Expression"}
        ]
    },

    //[6]  Symbol     ::= [a-zA-Z_] [a-zA-Z_0-9]*
    "Symbol": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_CHARSET, value: /[a-zA-Z_]/},
            {type: TERM_CHARSET, value: /[a-zA-Z_0-9]/, quantifier: QUANTIFIER_STAR}
        ]
    },

    //[7]  Expression ::= Term (S '|' S Term)*
    "Expression": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Term"},
            {type: TERMS_SEQUENCE, quantifier: QUANTIFIER_STAR,
            terms: [
                {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                {type: TERM_LITERAL, value: "|"},
                {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                {type: TERM_NONTERMINAL, value: "Term"}
            ] }
        ]
    },

    //[8]  Term       ::= Exception (S (Exception | VC | WFC))*
    "Term": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Exception"},
            {type: TERMS_SEQUENCE, quantifier: QUANTIFIER_STAR,
            terms: [
                {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                {type: TERMS_OR, terms: [
                    {type: TERM_NONTERMINAL, value: "Exception"},
                    {type: TERM_NONTERMINAL, value: "VC"},
                    {type: TERM_NONTERMINAL, value: "WFC"}
                ] }
            ] }
        ]
    },

    //[9]  VC         ::= '[' S? [vV] [cC] ':' [^]]* ']'
    "VC": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "["},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_CHARSET, value: /[vV]/},
            {type: TERM_CHARSET, value: /[cC]/},
            {type: TERM_LITERAL, value: ":"},
            {type: TERM_CHARSET, value: /[^\]]/, quantifier: QUANTIFIER_STAR},
            {type: TERM_LITERAL, value: "]"}
        ]
    },

    //[10] WFC        ::= '[' S? [wW] [fF] [cC] ':' [^]]* ']'
    "WFC": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "["},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_CHARSET, value: /[wW]/},
            {type: TERM_CHARSET, value: /[fF]/},
            {type: TERM_CHARSET, value: /[cC]/},
            {type: TERM_LITERAL, value: ":"},
            {type: TERM_CHARSET, value: /[^\]]/, quantifier: QUANTIFIER_STAR},
            {type: TERM_LITERAL, value: "]"}
        ]
    },

    //[11] Exception  ::= Factor (S '-' S Factor)?
    "Exception": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Factor"},
            {type: TERMS_SEQUENCE, quantifier: QUANTIFIER_QMARK,
            terms: [
                {type: TERM_NONTERMINAL, value: "S"},
                {type: TERM_LITERAL, value: "-"},
                {type: TERM_NONTERMINAL, value: "S"},
                {type: TERM_NONTERMINAL, value: "Factor"}
            ] }
        ]
    },

    //[12] Factor     ::= (Symbol | HexChar | Charset | Literal | (S? '(' S? Expression S? ')' S?)) Quantifier?
    "Factor": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERMS_OR, terms: [
                {type: TERM_NONTERMINAL, value: "Symbol"},
                {type: TERM_NONTERMINAL, value: "HexChar"},
                {type: TERM_NONTERMINAL, value: "Charset"},
                {type: TERM_NONTERMINAL, value: "Literal"},
                {type: TERMS_SEQUENCE, terms: [
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: '('},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_NONTERMINAL, value: "Expression"},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: ')'},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK}
                ] }
            ] },
            {type: TERM_NONTERMINAL, value: "Quantifier", quantifier: QUANTIFIER_QMARK}
        ]
    },

    //[13] Quantifier ::= '*' | '+' | '?'
    "Quantifier": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_CHARSET, value: /[*+?]/}
        ]
    },

    //[14] HexChar    ::= '#x' [0-9a-fA-F]+
    "HexChar": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "#x"},
            {type: TERM_CHARSET, value: /[0-9a-fA-F]/, quantifier: QUANTIFIER_PLUS}
        ]
    },

    //[15] Charset    ::= '[' '^'? (CharRange | Char | '-') (CharRange | Char)* ']'
    "Charset": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "["},
            {type: TERM_LITERAL, value: "^", quantifier: QUANTIFIER_QMARK},
            {type: TERMS_OR, terms: [
                {type: TERM_NONTERMINAL, value: "CharRange"},
                {type: TERM_NONTERMINAL, value: "Char"},
                {type: TERM_LITERAL, value: "-"}
            ] },
            {type: TERMS_OR, quantifier: QUANTIFIER_STAR,
            terms: [
                {type: TERM_NONTERMINAL, value: "CharRange"},
                {type: TERM_NONTERMINAL, value: "Char"}
            ] },
            {type: TERM_LITERAL, value: "]"}
        ]
    },

    //[16] Char       ::= [^-]]
    "Char": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_CHARSET, value: /[^-\]]/}
        ]
    },
    
    //[17] CharRange  ::= (Char '-' Char) | (HexChar '-' HexChar)
    "CharRange": {
        type: TERMS_OR,
        terms: [
            {type: TERMS_SEQUENCE, terms: [
                {type: TERM_NONTERMINAL, value: "Char"},
                {type: TERM_LITERAL, value: "-"},
                {type: TERM_NONTERMINAL, value: "Char"}
            ] },
            {type: TERMS_SEQUENCE, terms: [
                {type: TERM_NONTERMINAL, value: "HexChar"},
                {type: TERM_LITERAL, value: "-"},
                {type: TERM_NONTERMINAL, value: "HexChar"}
            ] }
        ]
    },

    //[18] Literal    ::= '"' [^"]* '"' | "'" [^']* "'"
    "Literal": {
        type: TERMS_OR,
        terms: [
            {type: TERMS_SEQUENCE, terms: [
                {type: TERM_LITERAL, value: '"'},
                {type: TERM_CHARSET, value: /[^"]/, quantifier: QUANTIFIER_STAR},
                {type: TERM_LITERAL, value: '"'}
            ] },
            {type: TERMS_SEQUENCE, terms: [
                {type: TERM_LITERAL, value: "'"},
                {type: TERM_CHARSET, value: /[^']/, quantifier: QUANTIFIER_STAR},
                {type: TERM_LITERAL, value: "'"}
            ] }
        ]
    }

};

var events = ["grammar", "Rule", "RuleNumber", "Production",
    "Symbol", "Expression", "Term", "VC", "WFC", "Exception",
    "Factor", "Quantifier", "HexChar", "CharSet", "Char",
    "CharRange", "Literal"];