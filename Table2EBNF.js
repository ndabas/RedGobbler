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
        s += prod + "\t ::= " + printTerms(p[prod]) + "\n\n";
    }
    s = s.replace(/[ ]+/g, " ");
    return s;
}

function printTerms(prod)
{
    var v, s = new String();
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
            v = prod.terms[i].value.toString();
            
            if(prod.terms[i].type == TERM_LITERAL)
            {
                s += "'";
                v = v.replace(/\n/g, "\\n");
                v = v.replace(/\r/g, "\\r");
                v = v.replace(/\t/g, "\\t");
            }
            
            if(prod.terms[i].type == TERM_CHARSET)
                v = v.substr(1, v.length - 2);
            s += v;
            
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