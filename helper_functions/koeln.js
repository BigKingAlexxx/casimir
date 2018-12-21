String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function replaceAt(string, index, replace) {
    return string.substring(0, index) + replace + string.substring(index + 1);
}

module.exports = function (input) {
    input = input.toLowerCase();
    input = input.replaceAll(/[ /-]/gm, "");
    var result = '';
    var n = 0;
    var pred;
    var succ;
    let cp;
    let cs;

    for (let char of input) {
        pred = n - 1;
        succ = n + 1;
        cp = input.charAt(pred);
        cs = input.charAt(succ);
        //console.log(char)
        switch (char) {
            case 'a':
            case 'e':
            case 'i':
            case 'j':
            case 'o':
            case 'u':
            case 'y':
            case 'ä':
            case 'ö':
            case 'ü':
            case 'ß':
                result += '0'
                break;

            case 'h':
                break;

            case 'b':
                result += '1'
                break;

            case 'p':
                if (cs !== 'h') result += '1'
                else result += '3'
                break;
            case 'd':
            case 't':
                if (cs !== 'c' || cs !== 's' || cs !== 'z') result += '2';
                else result += '8';
                break;
            case 'f':
            case 'v':
            case 'w':
                result += '3'
                break;
            case 'g':
            case 'k':
            case 'q':
                result += '4'
                break;

            case 'c':
                if (n === 0 && (cs === 'a' || cs === 'h' || cs === 'k' || cs === 'l' || cs === 'o' || cs === 'q' || cs === 'r' || cs === 'u' || cs === 'x')) result += '4'
                else if ((cs === 'a' || cs === 'h' || cs === 'k' || cs === 'o' || cs === 'q' || cs === 'u' || cs === 'x') && (cp !== 's' || cp !== 'z')) result += '4'
                else if (n !== 0 && (cp === 's' || cp === 'z')) result += '8'
                else if (n === 0 && (cs !== 'a' || cs !== 'h' || cs !== 'k' || cs !== 'l' || cs !== 'o' || cs !== 'q' || cs !== 'r' || cs !== 'u' || cs !== 'x')) result += '8'
                else if (cs !== 'a' || cs !== 'h' || cs !== 'k' || cs !== 'o' || cs !== 'q' || cs !== 'u' || cs !== 'x') result += '8';
                break;

            case 'x':
                if (n !== 0 && (cp !== 'c' || cp !== 'k' || cp !== 'q')) result += '48'
                else if (n !== 0 && (cp === 'c' || cp === 'k' || cp === 'q')) result += '8'
                else result += '48'
                break;

            case 'l':
                result += '5'
                break;
            case 'm':
            case 'n':
                result += '6'
                break;

            case 'r':
                result += '7'
                break;
            case 's':
            case 'z':
                result += '8'
                break;
            default:
                console.log("AMANA");
                break;
        }
        //console.log('Schleifendurchgang ' + n + ': ' + result + " " + char);

        n++;
    }

    //console.log('For Schleife 1: ' + result);
    for (let i = 0; i < result.length - 1; i++) {
        if (result.charAt(i) === result.charAt(i + 1)) {
            result = replaceAt(result, i, '');
        }
    }

    //console.log('For Schleife 2: ' + result)
    //console.log(result.length)
    for (let i = 0; i < result.length; i++) {
        if (result.charAt(i) === '0' && i > 0) result = replaceAt(result, i, '');
    }

    return result;
}






/* console.log('Ergebnis für hill cf skye: ' + col('hills cf skye'));
console.log('Ergebnis für hillcfskye: ' + col('hillscfskye'));
console.log('Ergebnis für Zylowski: ' + col('Zylowski'));
console.log('Ergebnis für I lovsky: ' + col('I lovsky'));
 */

/*  console.log(col("Felic"))
 console.log(col("Herr"))
 console.log(col("Zylowski"))
 console.log(col("Zeimet"))
 console.log(col("Görlich"))
 console.log(col("Felix"))
 console.log(col("Felik"))
 */