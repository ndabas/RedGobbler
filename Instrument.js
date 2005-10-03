//
//
//

var points = new Object();
var calls = new Object();

function Instrument_enter(point)
{
    if(!points[point])
    {
        points[point] = 0;
        calls[point] = 0;
    }
    
    points[point] += (new Date().getTime());
    calls[point]++;
}

function Instrument_exit(point)
{
    points[point] = (new Date().getTime()) - points[point];
}

function Instrument_report()
{
    var s = new String();
    
    for(point in points)
    {
        s += point + "," + calls[point] + "," + points[point];
        s += "," + (points[point] / calls[point]) + "\r\n";
    }
    
    return s;
}