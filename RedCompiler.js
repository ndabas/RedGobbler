//
//
//

function RedCompiler_compile(productions)
{
    
}

function sprintf(formatString)
{
    var pieces = formatString.split("%s");
    var out = new String();
    var times = arguments.length < pieces.length ? arguments.length : pieces.length;
    times--;
    
    for(var i = 0; i < times; i++)
    {
        out += pieces[i] + arguments[i + 1];
    }
    
    out += pieces.slice(times).join("");
    return out;
}