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

function RedGobbler(productions, events, handler)
{
    this.productions = productions;
    this.events = new Object();
    
    for(var i = 0; i < events.length; i++)
        this.events[events[i]] = true;
    
    this.handler = handler;
    this.parse = RedGobbler_parse;
    this.callHandler = RedGobbler_callHandler;
    this.matchTerm = RedGobbler_matchTerm;
}

function RedGobbler_parse(text, production)
{
    this.text = text;
    this.chars = new Array(this.text.length);
    
    for(var i = 0; i < this.chars.length; i++)
        this.chars[i] = this.text.charAt(i);
    
    for(p in this.productions)
        this.productions[p].matches = new Array();
    
    var n = this.matchTerm(this.productions[production], 0);
    if(n !== null)
        this.callHandler(production, 0, n);
    
    return n;
}

function RedGobbler_callHandler(production, index, length)
{
    if(this.events[production])
        this.handler(production, index, index + length);
}

function RedGobbler_matchTerm(term, index)
{
    var tn, n, matches = 0, newIndex = index, tindex;
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
            for(var i = 0; i < term.terms.length; i++)
            {
                if((n = this.matchTerm(term.terms[i], newIndex)) !== null)
                    break;
            }
            
            break;
            
        case TERMS_SEQUENCE:
            tindex = newIndex;
            
            for(var i = 0; i < term.terms.length; i++)
            {
                if((tn = this.matchTerm(term.terms[i], tindex)) !== null)
                    tindex += tn;
                else break;
            }
            
            if(tn !== null)
                n = tindex - newIndex;
            
            break;
            
        case TERMS_EXCEPTION:
            if((n = this.matchTerm(term.terms[0], newIndex)) === null)
                break;
    
            if((this.matchTerm(term.terms[1], newIndex)) !== null)
                n = null;
    
            break;
            
        case TERM_CHARSET:
            if(newIndex < this.text.length && term.value.test(this.chars[newIndex]))
                n = 1;
            
            break;
            
        case TERM_LITERAL:
            if(newIndex < this.text.length && this.text.substr(newIndex, term.value.length) == term.value)
                n = term.value.length;
            
            break;
            
        case TERM_NONTERMINAL:
            if((n = this.productions[term.value].matches[newIndex]) == undefined)
            {
                n = this.matchTerm(this.productions[term.value], newIndex);
                this.productions[term.value].matches[newIndex] = n;
            }
            
            if(n !== null)
                this.callHandler(term.value, newIndex, n);
            
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