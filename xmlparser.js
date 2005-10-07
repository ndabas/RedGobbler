// 
// XML Parser in JS 
//

var productions = {
    
    // [1]    document    ::=    prolog element Misc* 
    "document": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "prolog"},
            {type: TERM_NONTERMINAL, value: "element"},
            {type: TERM_NONTERMINAL, value: "Misc", quantifier: QUANTIFIER_STAR}
        ]
    },
    
    // [2]    Char    ::=    #x9 | #xA | #xD | [#x20-#xD7FF] |
    //                       [#xE000-#xFFFD] | [#x10000-#x10FFFF] 
    "Char": {
        type: TERMS_SEQUENCE,
        terms: [ {type: TERM_CHARSET, value: /[\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/} ]
    },
    
    // [3]    S    ::=    (#x20 | #x9 | #xD | #xA)+ 
    "S": {
        type: TERMS_SEQUENCE,
        terms: [ {type: TERM_CHARSET, value: /[\u0020\u0009\u000D\u000A]/, quantifier: QUANTIFIER_PLUS} ]
    },
    
    // [4]    NameChar    ::=    Letter | Digit | '.' | '-' | '_' | ':' | CombiningChar | Extender 
    "NameChar": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "Letter"},
            {type: TERM_NONTERMINAL, value: "Digit"},
            {type: TERM_CHARSET, value: /[\.\-_:]/},
            {type: TERM_NONTERMINAL, value: "CombiningChar"},
            {type: TERM_NONTERMINAL, value: "Extender"}
        ]
    },
    
    // [5]    Name    ::=    (Letter | '_' | ':') (NameChar)* 
    "Name": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERMS_OR, terms: [
                    {type: TERM_NONTERMINAL, value: "Letter"},
                    {type: TERM_CHARSET, value: /[_:]/}
                ]
            },
            {type: TERM_NONTERMINAL, value: "NameChar", quantifier: QUANTIFIER_STAR}
        ]
    },
    
    // [6]    Names    ::=    Name (#x20 Name)* 
    "Names": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERMS_SEQUENCE, quantifier: QUANTIFIER_STAR,
            terms: [
                    {type: TERM_CHARSET, value: /[\u0020]/},
                    {type: TERM_NONTERMINAL, value: "Name"}
                ]
            }
        ]
    },
    
    // [7]    Nmtoken    ::=    (NameChar)+ 
    "Nmtoken": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "NameChar", quantifier: QUANTIFIER_PLUS}
        ]
    },
    
    // [8]    Nmtokens    ::=    Nmtoken (#x20 Nmtoken)* 
    "Nmtokens": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Nmtoken"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_CHARSET, value: /[\u0020]/},
                    {type: TERM_NONTERMINAL, value: "Nmtoken"}
                ]
            }
        ]
    },
    
    // [9]    EntityValue    ::=    '"' ([^%&"] | PEReference | Reference)* '"'  
    //                              |  "'" ([^%&'] | PEReference | Reference)* "'" 
    "EntityValue": {
        type: TERMS_OR,
        terms: [
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: '"'},
                    {
                        type: TERMS_OR,
                        quantifier: QUANTIFIER_STAR,
                        terms: [
                            {type: TERM_CHARSET, value: /[^%&"]/},
                            {type: TERM_NONTERMINAL, value: "PEReference"},
                            {type: TERM_NONTERMINAL, value: "Reference"}
                        ]
                    },
                    {type: TERM_LITERAL, value: '"'}
                ]
            },
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "'"},
                    {
                        type: TERMS_OR,
                        quantifier: QUANTIFIER_STAR,
                        terms: [
                            {type: TERM_CHARSET, value: /[^%&']/},
                            {type: TERM_NONTERMINAL, value: "PEReference"},
                            {type: TERM_NONTERMINAL, value: "Reference"}
                        ]
                    },
                    {type: TERM_LITERAL, value: "'"}
                ]
            }
        ]
    },
    
    // [10]    AttValue    ::=    '"' ([^<&"] | Reference)* '"'  
    //                            |  "'" ([^<&'] | Reference)* "'" 
    "AttValue": {
        type: TERMS_OR,
        terms: [
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: '"'},
                    {
                        type: TERMS_OR,
                        quantifier: QUANTIFIER_STAR,
                        terms: [
                            {type: TERM_CHARSET, value: /[^<&"]/},
                            {type: TERM_NONTERMINAL, value: "Reference"}
                        ]
                    },
                    {type: TERM_LITERAL, value: '"'}
                ]
            },
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "'"},
                    {
                        type: TERMS_OR,
                        quantifier: QUANTIFIER_STAR,
                        terms: [
                            {type: TERM_CHARSET, value: /[^<&']/},
                            {type: TERM_NONTERMINAL, value: "Reference"}
                        ]
                    },
                    {type: TERM_LITERAL, value: "'"}
                ]
            }
        ]
    },
    
    // [11]    SystemLiteral    ::=    ('"' [^"]* '"') | ("'" [^']* "'")
    "SystemLiteral": {
        type: TERMS_OR,
        terms: [
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: '"'},
                    {type: TERM_CHARSET, value: /[^"]/, quantifier: QUANTIFIER_STAR},
                    {type: TERM_LITERAL, value: '"'}
                ]
            },
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "'"},
                    {type: TERM_CHARSET, value: /[^']/, quantifier: QUANTIFIER_STAR},
                    {type: TERM_LITERAL, value: "'"}
                ]
            }
        ]
    },
    
    // [12]    PubidLiteral    ::=    '"' PubidChar* '"' | "'" (PubidChar - "'")* "'" 
    "PubidLiteral": {
        type: TERMS_OR,
        terms: [
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: '"'},
                    {type: TERM_NONTERMINAL, value: "PubidChar", quantifier: QUANTIFIER_STAR},
                    {type: TERM_LITERAL, value: '"'}
                ]
            },
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "'"},
                    {
                        type: TERMS_EXCEPTION,
                        quantifier: QUANTIFIER_STAR,
                        terms: [
                            {type: TERM_NONTERMINAL, value: "PubidChar"},
                            {type: TERM_LITERAL, value: "'"}
                        ]
                    },
                    {type: TERM_LITERAL, value: "'"}
                ]
            }
        ]
    },
    
    // [13]    PubidChar    ::=    #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]
    "PubidChar": {
        type: TERMS_OR,
        terms: [
            {type: TERM_CHARSET, value: /[\u0020]/},
            {type: TERM_CHARSET, value: /[\u000D]/},
            {type: TERM_CHARSET, value: /[\u000A]/},
            {type: TERM_CHARSET, value: /[a-zA-Z0-9]/},
            {type: TERM_CHARSET, value: /[\-'()+,\.\/:=?;!*#@$_%]/}
        ]
    },
    
    // [14]    CharData    ::=    [^<&]* - ([^<&]* ']]>' [^<&]*)
    "CharData": {
        type: TERMS_SEQUENCE,
        terms: [
            {
                type: TERMS_EXCEPTION,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_CHARSET, value: /[^<&]/},
                    {type: TERM_LITERAL, value: "]]>"}
                ]
            }
        ]
    },
    
    // [15]    Comment    ::=    '<!--' ((Char - '-') | ('-' (Char - '-')))* '-->' 
    "Comment": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!--"},
            {
                type: TERMS_OR,
                terms: [
                    {
                        type: TERMS_EXCEPTION,
                        terms: [
                            {type: TERM_NONTERMINAL, value: "Char"},
                            {type: TERM_LITERAL, value: "-"}
                        ]
                    },
                    {
                        type: TERMS_SEQUENCE,
                        terms: [
                            {type: TERM_LITERAL, value: "-"},
                            {
                                type: TERMS_EXCEPTION,
                                terms: [
                                    {type: TERM_NONTERMINAL, value: "Char"},
                                    {type: TERM_LITERAL, value: "-"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {type: TERM_LITERAL, value: "-->"}
        ]
    },
    
    // [16]    PI    ::=    '<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
    "PI": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<?"},
            {type: TERM_NONTERMINAL, value: "PITarget"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_QMARK,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S"},
                    {
                        type: TERMS_EXCEPTION,
                        quantifier: QUANTIFIER_STAR,
                        terms: [
                            {type: TERM_NONTERMINAL, value: "Char"},
                            {type: TERM_LITERAL, value: "?>"}
                        ]
                    }
                ]
            },
            {type: TERM_LITERAL, value: "?>"}
        ]
    },
    
    // [17]    PITarget    ::=    Name - (('X' | 'x') ('M' | 'm') ('L' | 'l'))
    "PITarget": {
        type: TERMS_EXCEPTION,
        terms: [
            {type: TERM_NONTERMINAL, value: "Name"},
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {
                        type: TERMS_OR,
                        terms:[
                            {type: TERM_LITERAL, value: "X"},
                            {type: TERM_LITERAL, value: "x"}
                        ]
                    },
                    {
                        type: TERMS_OR,
                        terms:[
                            {type: TERM_LITERAL, value: "M"},
                            {type: TERM_LITERAL, value: "m"}
                        ]
                    },
                    {
                        type: TERMS_OR,
                        terms:[
                            {type: TERM_LITERAL, value: "L"},
                            {type: TERM_LITERAL, value: "l"}
                        ]
                    }
                ]
            }
        ]
    },
    
    // [18]    CDSect    ::=    CDStart CData CDEnd 
    "CDSect": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "CDStart"},
            {type: TERM_NONTERMINAL, value: "CData"},
            {type: TERM_NONTERMINAL, value: "CDEnd"}
        ]
    },
    
    // [19]    CDStart    ::=    '<![CDATA[' 
    "CDStart": {
        type: TERMS_SEQUENCE,
        terms: [ {type: TERM_LITERAL, value: "<![CDATA["} ]
    },
    
    // [20]    CData    ::=    (Char* - (Char* ']]>' Char*)) 
    "CData": {
        type: TERMS_SEQUENCE,
        terms: [
            {
                type: TERMS_EXCEPTION,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "Char"},
                    {type: TERM_LITERAL, value: "]]>"}
                ]
            }
        ]
    },
    
    // [21]    CDEnd    ::=    ']]>' 
    "CDEnd": {
        type: TERMS_SEQUENCE,
        terms: [ {type: TERM_LITERAL, value: "]]>"} ]
    },
    
    // [22]    prolog    ::=    XMLDecl? Misc* (doctypedecl Misc*)?
    "prolog": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "XMLDecl", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "Misc", quantifier: QUANTIFIER_STAR},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_QMARK,
                terms: [
                    {type: TERM_NONTERMINAL, value: "doctypedecl"},
                    {type: TERM_NONTERMINAL, value: "Misc", quantifier: QUANTIFIER_STAR}
                ]
            }
        ]
    },
    
    // [23]    XMLDecl    ::=    '<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>' 
    "XMLDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<?xml"},
            {type: TERM_NONTERMINAL, value: "VersionInfo"},
            {type: TERM_NONTERMINAL, value: "EncodingDecl", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "SDDecl", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "?>"}
        ]
    },
    
    // [24]    VersionInfo    ::=    S 'version' Eq ("'" VersionNum "'" | '"' VersionNum '"') 
    "VersionInfo": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_LITERAL, value: "version"},
            {type: TERM_NONTERMINAL, value: "Eq"},
            {
                type: TERMS_OR,
                terms: [
                    {
                        type: TERMS_SEQUENCE,
                        terms: [
                            {type: TERM_LITERAL, value: "'"},
                            {type: TERM_NONTERMINAL, value: "VersionNum"},
                            {type: TERM_LITERAL, value: "'"}
                        ]
                    },
                    {
                        type: TERMS_SEQUENCE,
                        terms: [
                            {type: TERM_LITERAL, value: '"'},
                            {type: TERM_NONTERMINAL, value: "VersionNum"},
                            {type: TERM_LITERAL, value: '"'}
                        ]
                    }
                ]
            }
        ]
    },
    
    // [25]    Eq    ::=    S? '=' S? 
    "Eq": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "="},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK}
        ]
    },
    
    // [26]    VersionNum    ::=    '1.0' 
    "VersionNum": {
        type: TERMS_SEQUENCE,
        terms: [ {type: TERM_LITERAL, value: "1.0"} ]
    },
    
    // [27]    Misc    ::=    Comment | PI | S 
    "Misc": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "Comment"},
            {type: TERM_NONTERMINAL, value: "PI"},
            {type: TERM_NONTERMINAL, value: "S"}
        ]
    },
    
    // [28]    doctypedecl    ::=    '<!DOCTYPE' S Name (S ExternalID)? S? ('[' intSubset ']' S?)? '>' 
    "doctypedecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!DOCTYPE"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_QMARK,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S"},
                    {type: TERM_NONTERMINAL, value: "ExternalID"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_QMARK,
                terms: [
                    {type: TERM_LITERAL, value: "["},
                    {type: TERM_NONTERMINAL, value: "intSubset"},
                    {type: TERM_LITERAL, value: "]"},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK}
                ]
            },
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [28a]    DeclSep    ::=    PEReference | S 
    "DeclSep": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "PEReference"},
            {type: TERM_NONTERMINAL, value: "S"}
        ]
    },
    
    // [28b]    intSubset    ::=    (markupdecl | DeclSep)* 
    "intSubset": {
        type: TERMS_SEQUENCE,
        terms: [
            {
                type: TERMS_OR,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "markupdecl"},
                    {type: TERM_NONTERMINAL, value: "DeclSep"}
                ]
            }
        ]
    },
    
    // [29]    markupdecl    ::=    elementdecl | AttlistDecl | EntityDecl | NotationDecl | PI | Comment 
    "markupdecl": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "elementdecl"},
            {type: TERM_NONTERMINAL, value: "AttlistDecl"},
            {type: TERM_NONTERMINAL, value: "EntityDecl"},
            {type: TERM_NONTERMINAL, value: "NotationDecl"},
            {type: TERM_NONTERMINAL, value: "PI"},
            {type: TERM_NONTERMINAL, value: "Comment"}
        ]
    },
    
    // [30]    extSubset    ::=    TextDecl? extSubsetDecl 
    "extSubset": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "TextDecl", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "extSubsetDecl"}
        ]
    },
    
    // [31]    extSubsetDecl    ::=    ( markupdecl | conditionalSect | DeclSep)* 
    "extSubsetDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {
                type: TERMS_OR,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "markupdecl"},
                    {type: TERM_NONTERMINAL, value: "conditionalSect"},
                    {type: TERM_NONTERMINAL, value: "DeclSep"}
                ]
            }
        ]
    },
    
    // [32]    SDDecl    ::=    S 'standalone' Eq (("'" ('yes' | 'no') "'") | ('"' ('yes' | 'no') '"'))  
    "SDDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_LITERAL, value: "standalone"},
            {type: TERM_NONTERMINAL, value: "Eq"},
            {
                type: TERMS_OR,
                terms: [
                    {
                        type: TERMS_SEQUENCE,
                        terms: [
                            {type: TERM_LITERAL, value: "'"},
                            {
                                type: TERMS_OR,
                                terms: [
                                    {type: TERM_LITERAL, value: "yes"},
                                    {type: TERM_LITERAL, value: "no"}
                                ]
                            },
                            {type: TERM_LITERAL, value: "'"}
                        ]
                    },
                    {
                        type: TERMS_SEQUENCE,
                        terms: [
                            {type: TERM_LITERAL, value: '"'},
                            {
                                type: TERMS_OR,
                                terms: [
                                    {type: TERM_LITERAL, value: "yes"},
                                    {type: TERM_LITERAL, value: "no"}
                                ]
                            },
                            {type: TERM_LITERAL, value: '"'}
                        ]
                    }
                ]
            }
        ]
    },
    
    // [39]    element    ::=    EmptyElemTag | STag content ETag 
    "element": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "EmptyElemTag"},
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_NONTERMINAL, value: "STag"},
                    {type: TERM_NONTERMINAL, value: "content"},
                    {type: TERM_NONTERMINAL, value: "ETag"}
                ]
            }
        ]
    },
    
    // [40]    STag    ::=    '<' Name (S Attribute)* S? '>' 
    "STag": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S"},
                    {type: TERM_NONTERMINAL, value: "Attribute"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [41]    Attribute    ::=    Name Eq AttValue 
    "Attribute": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "Eq"},
            {type: TERM_NONTERMINAL, value: "AttValue"}
        ]
    },
    
    // [42]    ETag    ::=    '</' Name S? '>' 
    "ETag": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "</"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [43]    content    ::=    CharData? ((element | Reference | CDSect | PI | Comment) CharData?)* 
    "content": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "CharData", quantifier: QUANTIFIER_QMARK},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {
                        type: TERMS_OR,
                        terms: [
                            {type: TERM_NONTERMINAL, value: "element"},
                            {type: TERM_NONTERMINAL, value: "Reference"},
                            {type: TERM_NONTERMINAL, value: "CDSect"},
                            {type: TERM_NONTERMINAL, value: "PI"},
                            {type: TERM_NONTERMINAL, value: "Comment"}
                        ]
                    },
                    {type: TERM_NONTERMINAL, value: "CharData", quantifier: QUANTIFIER_QMARK}
                ]
            }
        ]
    },
    
    // [44]    EmptyElemTag    ::=    '<' Name (S Attribute)* S? '/>'
    "EmptyElemTag": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S"},
                    {type: TERM_NONTERMINAL, value: "Attribute"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "/>"}
        ]
    },
    
    // [45]    elementdecl    ::=    '<!ELEMENT' S Name S contentspec S? '>' 
    "elementdecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!ELEMENT"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "contentspec"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [46]    contentspec    ::=    'EMPTY' | 'ANY' | Mixed | children 
    "contentspec": {
        type: TERMS_OR,
        terms: [
            {type: TERM_LITERAL, value: "EMPTY"},
            {type: TERM_LITERAL, value: "ANY"},
            {type: TERM_NONTERMINAL, value: "Mixed"},
            {type: TERM_NONTERMINAL, value: "children"}
        ]
    },
    
    // [47]    children    ::=    (choice | seq) ('?' | '*' | '+')? 
    "children": {
        type: TERMS_SEQUENCE,
        terms: [
            {
                type: TERMS_OR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "choice"},
                    {type: TERM_NONTERMINAL, value: "seq"}
                ]
            },
            {
                type: TERMS_OR,
                quantifier: QUANTIFIER_QMARK,
                terms: [
                    {type: TERM_LITERAL, value: "?"},
                    {type: TERM_LITERAL, value: "*"},
                    {type: TERM_LITERAL, value: "+"}
                ]
            }
        ]
    },
    
    // cp    ::=    (Name | choice | seq) ('?' | '*' | '+')? 
    "cp": {
        type: TERMS_SEQUENCE,
        terms: [
            {
                type: TERMS_OR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "Name"},
                    {type: TERM_NONTERMINAL, value: "choice"},
                    {type: TERM_NONTERMINAL, value: "seq"}
                ]
            },
            {
                type: TERMS_OR,
                quantifier: QUANTIFIER_QMARK,
                terms: [
                    {type: TERM_LITERAL, value: "?"},
                    {type: TERM_LITERAL, value: "*"},
                    {type: TERM_LITERAL, value: "+"}
                ]
            }
        ]
    },
    
    // [49]    choice    ::=    '(' S? cp ( S? '|' S? cp )+ S? ')' 
    "choice": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "("},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "cp"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_PLUS,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: "|"},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_NONTERMINAL, value: "cp"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ")"}
        ]
    },
    
    // [50]    seq    ::=    '(' S? cp ( S? ',' S? cp )* S? ')' 
    "seq": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "("},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "cp"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: ","},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_NONTERMINAL, value: "cp"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ")"}
        ]
    },
    
    // [51]    Mixed    ::=    '(' S? '#PCDATA' (S? '|' S? Name)* S? ')*' | '(' S? '#PCDATA' S? ')'  
    "Mixed": {
        type: TERMS_OR,
        terms: [
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "("},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: "#PCDATA"},
                    {
                        type: TERMS_SEQUENCE,
                        quantifier: QUANTIFIER_STAR,
                        terms: [
                            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                            {type: TERM_LITERAL, value: "|"},
                            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                            {type: TERM_NONTERMINAL, value: "Name"}
                        ]
                    },
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: ")*"}
                ]
            },
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "("},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: "#PCDATA"},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: ")"}
                ]
            }
        ]
    },
    
    // [52]    AttlistDecl    ::=    '<!ATTLIST' S Name AttDef* S? '>'
    "AttlistDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!ATTLIST"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "AttDef", quantifier: QUANTIFIER_STAR},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [53]    AttDef    ::=    S Name S AttType S DefaultDecl 
    "AttDef": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "AttType"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "DefaultDecl"}
        ]
    },
    
    // [54]    AttType    ::=    StringType | TokenizedType | EnumeratedType 
    "AttType": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "StringType"},
            {type: TERM_NONTERMINAL, value: "TokenizedType"},
            {type: TERM_NONTERMINAL, value: "EnumeratedType"}
        ]
    },
    
    // [55]    StringType    ::=    'CDATA' 
    "StringType": {
        type: TERMS_SEQUENCE,
        terms: [ {type: TERM_LITERAL, value: "CDATA"} ]
    },
    
    // [56]    TokenizedType    ::=    'ID' | 'IDREF' | 'IDREFS' | 'ENTITY' | 'ENTITIES' | 'NMTOKEN' | 'NMTOKENS' 
    "TokenizedType": {
        type: TERMS_OR,
        terms: [
            {type: TERM_LITERAL, value:"ID"},
            {type: TERM_LITERAL, value:"IDREF"},
            {type: TERM_LITERAL, value:"IDREFS"},
            {type: TERM_LITERAL, value:"ENTITY"},
            {type: TERM_LITERAL, value:"ENTITIES"},
            {type: TERM_LITERAL, value:"NMTOKEN"},
            {type: TERM_LITERAL, value:"NMTOKENS"}
        ]
    },
    
    // [57]    EnumeratedType    ::=    NotationType | Enumeration 
    "EnumeratedType": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "NotationType"},
            {type: TERM_NONTERMINAL, value: "Enumeration"}
        ]
    },
    
    // [58]    NotationType    ::=    'NOTATION' S '(' S? Name (S? '|' S? Name)* S? ')' 
    "NotationType": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "NOTATION"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_LITERAL, value: "("},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "Name"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: "|"},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_NONTERMINAL, value: "Name"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ")"}
        ]
    },
    
    // [59]    Enumeration    ::=    '(' S? Nmtoken (S? '|' S? Nmtoken)* S? ')' 
    "Enumeration": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "("},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "Nmtoken"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_LITERAL, value: "|"},
                    {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
                    {type: TERM_NONTERMINAL, value: "Nmtoken"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ")"}
        ]
    },
    
    // [60]    DefaultDecl    ::=    '#REQUIRED' | '#IMPLIED' | (('#FIXED' S)? AttValue) 
    "DefaultDecl": {
        type: TERMS_OR,
        terms: [
            {type: TERM_LITERAL, value: "#REQUIRED"},
            {type: TERM_LITERAL, value: "#IMPLIED"},
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {
                        type: TERMS_SEQUENCE,
                        quantifier: QUANTIFIER_QMARK,
                        terms: [
                            {type: TERM_LITERAL, value: "#FIXED"},
                            {type: TERM_NONTERMINAL, value: "S"}
                        ]
                    },
                    {type: TERM_NONTERMINAL, value: "AttValue"}
                ]
            }
        ]
    },
    
    // [61]    conditionalSect    ::=    includeSect | ignoreSect 
    "conditionalSect": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "includeSect"},
            {type: TERM_NONTERMINAL, value: "ignoreSect"}
        ]
    },
    
    // [62]    includeSect    ::=    '<![' S? 'INCLUDE' S? '[' extSubsetDecl ']]>' 
    "includeSect": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!["},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "INCLUDE"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "["},
            {type: TERM_NONTERMINAL, value: "extSubsetDecl"},
            {type: TERM_LITERAL, value: "]]>"}
        ]
    },
    
    // [63]    ignoreSect    ::=    '<![' S? 'IGNORE' S? '[' ignoreSectContents* ']]>' 
    "ignoreSect": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!["},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "IGNORE"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "["},
            {type: TERM_NONTERMINAL, value: "ignoreSectContents", quantifier: QUANTIFIER_STAR},
            {type: TERM_LITERAL, value: "]]>"}
        ]
    },
    
    // [64]    ignoreSectContents    ::=    Ignore ('<![' ignoreSectContents ']]>' Ignore)* 
    "ignoreSectContents": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "Ignore"},
            {
                type: TERMS_SEQUENCE,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_LITERAL, value: "<!["},
                    {type: TERM_NONTERMINAL, value: "ignoreSectContents"},
                    {type: TERM_LITERAL, value: "]]>"},
                    {type: TERM_NONTERMINAL, value: "Ignore"}
                ]
            }
        ]
    },
    
    // [65]    Ignore    ::=    Char* - (Char* ('<![' | ']]>') Char*) 
    "Ignore": {
        type: TERMS_SEQUENCE,
        terms: [
            {
                type: TERMS_EXCEPTION,
                quantifier: QUANTIFIER_STAR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "Char"},
                    {
                        type: TERMS_OR,
                        terms: [
                            {type: TERM_LITERAL, value: "<!["},
                            {type: TERM_LITERAL, value: "]]>"}
                        ]
                    }
                ]
            }
        ]
    },
    
    // [66]    CharRef    ::=    '&#' [0-9]+ ';' | '&#x' [0-9a-fA-F]+ ';' 
    "CharRef": {
        type: TERMS_OR,
        terms: [
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "&#"},
                    {type: TERM_CHARSET, value: /[0-9]/, quantifier: QUANTIFIER_PLUS},
                    {type: TERM_LITERAL, value: ";"}
                ]
            },
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "&#x"},
                    {type: TERM_CHARSET, value: /[0-9a-fA-F]/, quantifier: QUANTIFIER_PLUS},
                    {type: TERM_LITERAL, value: ";"}
                ]
            }
        ]
    },
    
    // [67]    Reference    ::=    EntityRef | CharRef 
    "Reference": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "EntityRef"},
            {type: TERM_NONTERMINAL, value: "CharRef"}
        ]
    },
    
    // [68]    EntityRef    ::=    '&' Name ';' 
    "EntityRef": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "&"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_LITERAL, value: ";"}
        ]
    },
    
    // [69]    PEReference    ::=    '%' Name ';' 
    "PEReference": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "%"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_LITERAL, value: ";"}
        ]
    },
    
    // [70]    EntityDecl    ::=    GEDecl | PEDecl 
    "EntityDecl": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "GEDecl"},
            {type: TERM_NONTERMINAL, value: "PEDecl"}
        ]
    },
    
    // [71]    GEDecl    ::=    '<!ENTITY' S Name S EntityDef S? '>'
    "GEDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!ENTITY"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "EntityDef"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [72]    PEDecl    ::=    '<!ENTITY' S '%' S Name S PEDef S? '>' 
    "PEDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!ENTITY"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_LITERAL, value: "%"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "PEDef"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [73]    EntityDef    ::=    EntityValue| (ExternalID NDataDecl?) 
    "EntityDef": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "EntityValue"},
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_NONTERMINAL, value: "ExternalID"},
                    {type: TERM_NONTERMINAL, value: "NDataDecl", quantifier: QUANTIFIER_QMARK}
                ]
            }
        ]
    },
    
    // [74]    PEDef    ::=    EntityValue | ExternalID 
    "PEDef": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "EntityValue"},
            {type: TERM_NONTERMINAL, value: "ExternalID"}
        ]
    },
    
    // [75]    ExternalID    ::=    'SYSTEM' S SystemLiteral | 'PUBLIC' S PubidLiteral S SystemLiteral 
    "ExternalID": {
        type: TERMS_OR,
        terms: [
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "SYSTEM"},
                    {type: TERM_NONTERMINAL, value: "S"},
                    {type: TERM_NONTERMINAL, value: "SystemLiteral"}
                ]
            },
            {
                type: TERMS_SEQUENCE,
                terms: [
                    {type: TERM_LITERAL, value: "PUBLIC"},
                    {type: TERM_NONTERMINAL, value: "S"},
                    {type: TERM_NONTERMINAL, value: "PubidLiteral"},
                    {type: TERM_NONTERMINAL, value: "S"},
                    {type: TERM_NONTERMINAL, value: "SystemLiteral"}
                ]
            }
        ]
    },
    
    // [76]    NDataDecl    ::=    S 'NDATA' S Name 
    "NDataDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_LITERAL, value: "NDATA"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"}
        ]
    },
    
    // [77]    TextDecl    ::=    '<?xml' VersionInfo? EncodingDecl S? '?>'
    "TextDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<?xml"},
            {type: TERM_NONTERMINAL, value: "VersionInfo", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "EncodingDecl"},
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: "?>"}
        ]
    },
    
    // [78]    extParsedEnt    ::=    TextDecl? content
    "extParsedEnt": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "TextDecl", quantifier: QUANTIFIER_QMARK},
            {type: TERM_NONTERMINAL, value: "content"}
        ]
    },
    
    // [80]    EncodingDecl    ::=    S 'encoding' Eq ('"' EncName '"' | "'" EncName "'" ) 
    "EncodingDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_LITERAL, value: "encoding"},
            {type: TERM_NONTERMINAL, value: "Eq"},
            {
                type: TERMS_OR,
                terms: [
                    {
                        type: TERMS_SEQUENCE,
                        terms: [
                            {type: TERM_LITERAL, value: '"'},
                            {type: TERM_NONTERMINAL, value: "EncName"},
                            {type: TERM_LITERAL, value: '"'}
                        ]
                    },
                    {
                        type: TERMS_SEQUENCE,
                        terms: [
                            {type: TERM_LITERAL, value: "'"},
                            {type: TERM_NONTERMINAL, value: "EncName"},
                            {type: TERM_LITERAL, value: "'"}
                        ]
                    }
                ]
            }
        ]
    },
    
    // [81]    EncName    ::=    [A-Za-z] ([A-Za-z0-9._] | '-')* 
    "EncName": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_CHARSET, value: /[A-Za-z]/},
            {type: TERM_CHARSET, value: /[\-A-Za-z0-9\._]/}
        ]
    },
    
    // [82]    NotationDecl    ::=    '<!NOTATION' S Name S (ExternalID | PublicID) S? '>'
    "NotationDecl": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "<!NOTATION"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "Name"},
            {type: TERM_NONTERMINAL, value: "S"},
            {
                type: TERMS_OR,
                terms: [
                    {type: TERM_NONTERMINAL, value: "ExternalID"},
                    {type: TERM_NONTERMINAL, value: "PublicID"}
                ]
            },
            {type: TERM_NONTERMINAL, value: "S", quantifier: QUANTIFIER_QMARK},
            {type: TERM_LITERAL, value: ">"}
        ]
    },
    
    // [83]    PublicID    ::=    'PUBLIC' S PubidLiteral 
    "PublicID": {
        type: TERMS_SEQUENCE,
        terms: [
            {type: TERM_LITERAL, value: "PUBLIC"},
            {type: TERM_NONTERMINAL, value: "S"},
            {type: TERM_NONTERMINAL, value: "PubidLiteral"}
        ]
    },
    
    // [84]    Letter    ::=    BaseChar | Ideographic 
    "Letter": {
        type: TERMS_OR,
        terms: [
            {type: TERM_NONTERMINAL, value: "BaseChar"},
            {type: TERM_NONTERMINAL, value: "Ideographic"}
        ]
    },
    
    // [85]    BaseChar    ::=    [#x0041-#x005A] | [#x0061-#x007A] | [#x00C0-#x00D6] | [#x00D8-#x00F6] | [#x00F8-#x00FF]
    "BaseChar": {
        type: TERMS_OR,
        terms: [
            {type: TERM_CHARSET, value: /[\u0041-\u005A]/},
            {type: TERM_CHARSET, value: /[\u0061-\u007A]/},
            {type: TERM_CHARSET, value: /[\u00C0-\u00D6]/},
            {type: TERM_CHARSET, value: /[\u00D8-\u00F6]/},
            {type: TERM_CHARSET, value: /[\u00F8-\u00FF]/}
        ]
    },
    
    // [86]    Ideographic    ::=    [#x4E00-#x9FA5] | #x3007 | [#x3021-#x3029] 
    "Ideographic": {
        type: TERMS_OR,
        terms: [
            {type: TERM_CHARSET, value: /[\u4E00-\u9FA5]/},
            {type: TERM_CHARSET, value: /[\u3007]/},
            {type: TERM_CHARSET, value: /[\u3021-\u3029]/}
        ]
    },
    
    // [87]    CombiningChar    ::=    [#x0300-#x0345] | [#x0360-#x0361] | [#x0483-#x0486] 
    "CombiningChar": {
        type: TERMS_OR,
        terms: [
            {type: TERM_CHARSET, value: /[\u0300-\u0345]/},
            {type: TERM_CHARSET, value: /[\u0360-\u0361]/},
            {type: TERM_CHARSET, value: /[\u0483-\u0486]/}
        ]
    },
    
    // [88]    Digit    ::=    [#x0030-#x0039] | [#x0660-#x0669] | [#x06F0-#x06F9] 
    "Digit": {
        type: TERMS_OR,
        terms: [
            {type: TERM_CHARSET, value: /[\u0030-\u0039]/},
            {type: TERM_CHARSET, value: /[\u0660-\u0669]/},
            {type: TERM_CHARSET, value: /[\u06F0-\u06F9]/}
        ]
    },
    
    // [89]    Extender    ::=    #x00B7 | #x02D0 | #x02D1 | #x0387 | #x0640 | #x0E46 | #x0EC6 | #x3005 | [#x3031-#x3035] | [#x309D-#x309E] | [#x30FC-#x30FE] 
    "Extender": {
        type: TERMS_OR,
        terms: [
            {type: TERM_CHARSET, value: /[\u00B7]/},
            {type: TERM_CHARSET, value: /[\u02D0]/},
            {type: TERM_CHARSET, value: /[\u02D1]/}
        ]
    }
};

var events = ["document", "Name", "Names", "EntityValue",
    "AttValue", "SystemLiteral", "PubidLiteral", "CharData",
    "Comment", "PI", "PITarget", "CDSect", "CData", "prolog",
    "XMLDecl", "VersionInfo", "VersionNum", "doctypedecl",
    "SDDecl", "element", "STag", "Attribute", "ETag", "content",
    "EmptyElemTag", "Reference"];

