// 
//
//

function printEBNF(p)
{
    var prod;
    var s = new String();
    var i = 1;
    for(prod in p)
    {
        s += "[" + i++ + "] ";
        s += prod + "\t ::= " + printTerms(p[prod]) + "\n";
    }
    s = s.replace(/[ ]+/g, " ");
    return s;
}

function printTerms(prod)
{
    var s = new String();
    var join;
    
    switch(prod.type)
    {
    case TERMS_SEQUENCE:
        join = " ";
        break;
    case TERMS_OR:
        join = " | ";
        break;
    case TERMS_EXCEPTION:
        join = " - ";
        break;
    }
    
    for(var i = 0; i < prod.terms.length; i++)
    {
        if(prod.terms[i].type & 4)
        {
            if(prod.terms[i].type == TERM_LITERAL)
                s += "'";
            s += prod.terms[i].value;
            if(prod.terms[i].type == TERM_LITERAL)
                s += "'";
        }
        else
        {
            s += "(" + printTerms(prod.terms[i]) + ")";
        }
        if(prod.terms[i].quantifier)
        {
            switch(prod.terms[i].quantifier)
            {
            case QUANTIFIER_PLUS: s += "+"; break;
            case QUANTIFIER_QMARK: s += "?"; break;
            case QUANTIFIER_STAR: s += "*"; break;
            }
        }
        if(i != prod.terms.length - 1)
        {
            s += join;
        }
    }
    
    return s;
}