//
//
//

var TERMS_SEQUENCE   = 1;
var TERMS_OR         = 2;
var TERMS_EXCEPTION  = 3;
var TERM_CHARSET     = 4;
var TERM_LITERAL     = 5;
var TERM_NONTERMINAL = 6;
var QUANTIFIER_PLUS  = 1;
var QUANTIFIER_STAR  = 2;
var QUANTIFIER_QMARK = 3;

function Parser(productions, events, handler)
{
    this.productions = productions;
    this.events = new Object();
    
    for(var i = 0; i < events.length; i++)
    {
        this.events[events[i]] = true;
    }
    
    this.handler = handler;
    this.parse = Parser_parse;
    this.matchProduction = Parser_matchProduction;
    this.matchOrTerms = Parser_matchOrTerms;
    this.matchSequenceTerms = Parser_matchSequenceTerms;
    this.matchExceptionTerms = Parser_matchExceptionTerms;
    this.matchTerm = Parser_matchTerm;
}

function Parser_parse(text, production)
{
    this.text = text;
    return this.matchProduction(production, 0);
}

function Parser_matchProduction(production, index)
{
    if(!this.productions[production])
    {
        alert("ERROR: no production: " + production);
    }
    
    var match = this.matchTerm(this.productions[production], index);
    if(match !== null && this.events[production])
    {
        this.handler(production, index, index + match);
    }
    
    return match;
}

function Parser_matchOrTerms(terms, index)
{
    var n;
    for(var i = 0; i < terms.length; i++)
    {
        if((n = this.matchTerm(terms[i], index)) !== null)
            return n;
    }
    
    return null;
}

function Parser_matchSequenceTerms(terms, index)
{
    var n;
    var newIndex = index;
    
    for(var i = 0; i < terms.length; i++)
    {
        if((n = this.matchTerm(terms[i], newIndex)) !== null)
            newIndex += n;
        else return null;
    }
    
    return newIndex - index;
}

function Parser_matchExceptionTerms(terms, index)
{
    var n;
    if((n = this.matchTerm(terms[0], index)) === null)
        return null;
    
    if((this.matchTerm(terms[1], index)) !== null)
        return null;
    
    return n;
}

function Parser_matchTerm(term, index)
{
    var n, matches = 0, newIndex = index;
    var more = false;
    
    if(term.quantifier &&
            (term.quantifier == QUANTIFIER_PLUS ||
             term.quantifier == QUANTIFIER_STAR))
    {
        more = true;
    }
    
    do
    {
        n = null;
        switch(term.type)
        {
        case TERMS_OR:
            n = this.matchOrTerms(term.terms, newIndex);
            break;
            
        case TERMS_SEQUENCE:
            n = this.matchSequenceTerms(term.terms, newIndex);
            break;
            
        case TERMS_EXCEPTION:
            n = this.matchExceptionTerms(term.terms, newIndex);
            break;
            
        case TERM_CHARSET:
            if(newIndex < this.text.length && term.value.test(this.text.charAt(newIndex)))
                n = 1;
            break;
            
        case TERM_LITERAL:
            if(newIndex < this.text.length && this.text.substr(newIndex, term.value.length) == term.value)
                n = term.value.length;
            break;
            
        case TERM_NONTERMINAL:
            n = this.matchProduction(term.value, newIndex)
            break;
        }
        
        if(n !== null)
        {
            newIndex += n;
            matches++;
        }
    } while(more && n !== null);
    
    if(matches > 0 || (term.quantifier &&
            (term.quantifier == QUANTIFIER_QMARK ||
             term.quantifier == QUANTIFIER_STAR)))
    {
        return newIndex - index;
    }
    else return null;
}