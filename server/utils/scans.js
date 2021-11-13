const digitHeight = 4;
const digitWidth = 3;
const numberOfDigit = 9;
const numberOfColumn = digitWidth * numberOfDigit;
const nbCellInDigit = digitHeight * digitWidth;

const charValue = {
    "|": 1,
    "_": 2,
}

const digitsCode = {
    "011020200110": 0,
    "000000000110": 1,
    "001022200100": 2,
    "000022200110": 3,
    "010002000110": 4,
    "010022200010": 5,
    "011022200010": 6,
    "000020000110": 7,
    "011022200110": 8,
    "010022200110": 9,
}


function calcAccountNumber(num) {
    if (num.length === 1) return parseInt(num[0]);
    const calc = num.length * parseInt(num.shift());
    return calc + calcAccountNumber(num);
}

function checkAccountNumber(number) {
    if (number.includes('?')) return 'ILL';
    const validNumber = calcAccountNumber(number) % 11 === 0;
    return (validNumber) ? "" : "ERR";
}

function getDigit(code) {
    const digit =  digitsCode[code];
    return (digit !== undefined) ? digit : '?';
}

function getDigitFromLines(line) {
    let digits = [];
    let code = '';
    for (let column = 0; column < numberOfColumn; column++) {
        for (let l = 0; l < digitHeight; l++) {
            const char = line[l][column];
            code +=  charToDigit(char);
            if (code.length === nbCellInDigit) {
                const digit = getDigit(code)
                digits.push(digit);
                code = '';
            }
        }
    }
    const status = checkAccountNumber([...digits]);
    console.log(status)
    return {number: digits.join(''), lineMap: line, status};
}

function getEveryLines(arrDigitsNumbers, numbers = []) {
    if (arrDigitsNumbers.length === 0) return numbers;
    const line = [];
    for (let i = 0; i < digitHeight; i++) {
        line.push(arrDigitsNumbers.shift());
    }
    numbers.push(getDigitFromLines(line));
    return getEveryLines(arrDigitsNumbers, numbers);
}

function charToDigit(char) {
    const value = charValue[char];
    return value ? value : 0;
}

function numbersToArray(strNumbers) {
    let i = 0;
    let arr = [];
    let line = [];
    while (strNumbers[i]) {
        const char = strNumbers[i];
        line.push(char);
        i++;
        if (i > 0 && i % numberOfColumn === 0) {
            arr.push(line);
            line = [];
        }
    }
    return arr;
}

function refactorContentFile(contentFile) {
    const strToArrFile = `${contentFile}`.split("\r\n");
    let newStr = '';
    strToArrFile.forEach((line, index) => {
        const blankSpace = ' ';
        if((index > 0 && (index + 1) % 4 === 0) || line === '') {
            newStr += blankSpace.repeat(numberOfColumn);
        } else if (line.length < numberOfColumn) {
            newStr += line + blankSpace.repeat(numberOfColumn - line.length);
        } else if (line.length > numberOfColumn) {
            newStr += line.substr(0, numberOfColumn);
        } else {
            newStr +=  line;
        }
    })
    const nbLines = newStr.length / numberOfColumn;
    const nbNumberLines = nbLines / 4;
    if(newStr.length % numberOfColumn === 0 && nbNumberLines % 1 === 0) {
        return newStr;
    }
    return 'ERROR FILE';
}

function scansFile(contentFile) {
    const refactorData = refactorContentFile(contentFile);
    const numToArr = numbersToArray(refactorData);
    const lines = getEveryLines(numToArr);
    return lines;
}

module.exports = {scansFile};
