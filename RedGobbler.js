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
    
    this.Handler = handler;
    this.Parse = Parser_Parse;
    this.MatchProduction = Parser_MatchProduction;
    this.MatchOrTerms = Parser_MatchOrTerms;
    this.MatchSequenceTerms = Parser_MatchSequenceTerms;
    this.MatchExceptionTerms = Parser_MatchExceptionTerms;
    this.MatchTerm = Parser_MatchTerm;
}

function Parser_Parse(text, production)
{
    return this.MatchProduction(text, production, 0);
}

function Parser_MatchProduction(text, production, index)
{
    if(!this.productions[production])
    {
        alert("ERROR: no production: " + production);
    }
    var match = this.MatchTerm(text, this.productions[production], index);
    if(match !== null && this.events[production])
    //if(match !== null)
    {
        this.Handler(production, index, index + match);
    }
    //else this.Handler("NOT " + production, index, index + match);
    
    return match;
}

function Parser_MatchOrTerms(text, terms, index)
{
    var n;
    for(var i = 0; i < terms.length; i++)
    {
        if((n = this.MatchTerm(text, terms[i], index)) !== null)
            return n;
    }
    return null;
}

function Parser_MatchSequenceTerms(text, terms, index)
{
    var n;
    var newIndex = index;
    
    for(var i = 0; i < terms.length; i++)
    {
        if((n = this.MatchTerm(text, terms[i], newIndex)) !== null)
            newIndex += n;
        else return null;
    }
    return newIndex - index;
}

function Parser_MatchExceptionTerms(text, terms, index)
{
    var n;
    if((n = this.MatchTerm(text, terms[0], index)) === null)
        return null;
    if((this.MatchTerm(text, terms[1], index)) !== null)
        return null;
    return n;
}

function Parser_MatchTerm(text, term, index)
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
            n = this.MatchOrTerms(text, term.terms, newIndex);
            break;
            
        case TERMS_SEQUENCE:
            n = this.MatchSequenceTerms(text, term.terms, newIndex);
            break;
            
        case TERMS_EXCEPTION:
            n = this.MatchExceptionTerms(text, term.terms, newIndex);
            break;
            
        case TERM_CHARSET:
            if(newIndex < text.length && text.charAt(newIndex).search(term.value) == 0)
                n = 1;
            break;
            
        case TERM_LITERAL:
            if(newIndex < text.length && text.substr(newIndex, term.value.length) == term.value)
                n = term.value.length;
            break;
            
        case TERM_NONTERMINAL:
            n = this.MatchProduction(text, term.value, newIndex)
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