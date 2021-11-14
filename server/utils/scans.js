const fs = require('fs');
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

function match(code) {
    const match = [];
    for (const [key, value] of Object.entries(digitsCode)) {
        let add = 0;
        let remove = 0;
        for (let i = 0; i < code.length - 1; i++) {
            if (key[i] == code[i]) continue;
            if (code[i] == 0 && key[i] != 0) add++;
            if (code[i] != 0 && key[i] == 0) remove++;
        }
        if (add + remove > 1) continue;
        match.push(value);
    }
    return match;
}


function refactorDataForFile(data) {
    let str = '';
    data.forEach(data => {
        str += `${data.number}  ${data.status} \n`;
    })
    return str
}

function writeFile(data, filename) {
    return new Promise(((resolve, reject) => {
        fs.writeFile(`${filename}.txt`, refactorDataForFile(data), function (err) {
            if (err) {
                console.error(err)
                return reject(err)
            } else {
                resolve(data);
            }
        });
    }))
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
    const digit = digitsCode[code];
    return (digit !== undefined) ? digit : '?';
}

function getDigitFromLines(line) {
    let digits = [];
    let code = '';
    let codeMap = [];
    for (let column = 0; column < numberOfColumn; column++) {
        for (let l = 0; l < digitHeight; l++) {
            const char = line[l][column];
            code += charToDigit(char);
            if (code.length === nbCellInDigit) {
                codeMap.push(code);
                const digit = getDigit(code);
                digits.push(digit);
                code = '';
            }
        }
    }
    const status = checkAccountNumber([...digits]);
    return {number: digits.join(''), lineMap: line, status, codeMap};
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
        if ((index > 0 && (index + 1) % 4 === 0) || line === '') {
            newStr += blankSpace.repeat(numberOfColumn);
        } else if (line.length < numberOfColumn) {
            newStr += line + blankSpace.repeat(numberOfColumn - line.length);
        } else if (line.length > numberOfColumn) {
            newStr += line.substr(0, numberOfColumn);
        } else {
            newStr += line;
        }
    })
    const nbLines = newStr.length / numberOfColumn;
    const nbNumberLines = nbLines / 4;
    if (newStr.length % numberOfColumn === 0 && nbNumberLines % 1 === 0) {
        return newStr;
    }
    return 'ERROR FILE';
}

function getCombinations(arr, pre) {
    pre = pre || '';
    if (!arr.length) {
        return pre;
    }
    const ans = arr[0].reduce(function (ans, value) {
        return ans.concat(getCombinations(arr.slice(1), pre + value));
    }, []);
    return ans;
}

function checkERR(numberInfo) {
    const combinations = [];
    for (let i = 0; i < numberInfo.number.length; i++) {
        const code = numberInfo.codeMap[i];
        const matches = match(code);
        combinations.push(matches);
    }
    return combinations;
}

function checkILL(numberInfo) {
    const combinations = [];
    for (let i = 0; i < numberInfo.number.length; i++) {
        let digit = numberInfo.number[i];
        if (digit === '?') {
            const code = numberInfo.codeMap[i];
            const matches = match(code);
            combinations.push(matches.length > 0 ? matches : digit);
        } else {
            combinations.push([digit]);
        }
    }
    if (combinations.includes('?')) {
        return 'ILL';
    } else {
        return combinations;
    }
}


function checkNumbers(numbers) {
    numbers.map(numberInfo => {
        const possibilities = [];
        if (numberInfo.status !== "") {
            let tryFix;
            if (numberInfo.status === 'ILL') {
                tryFix = checkILL(numberInfo);
            } else {
                tryFix = checkERR(numberInfo);
            }
            if (tryFix !== 'ILL') {
                const combinations = getCombinations(tryFix);
                combinations.forEach(combination => {
                    const possibility = checkAccountNumber([...combination]);
                    if (possibility === '') {
                        possibilities.push(combination);
                    }

                })
            }
        }
        if (possibilities.length === 1) {
            numberInfo.number = possibilities[0];
            numberInfo.status = '';
        }
        if (possibilities.length > 1) {
            numberInfo.possibilities = possibilities;
            numberInfo.status = 'AMB';
        }
        return numberInfo;
    })
    return numbers;
}

function scansFile(contentFile, filename) {
    return new Promise(((resolve, reject) => {
        const refactorData = refactorContentFile(contentFile);
        if (refactorData === 'ERROR FILE') {
            reject('ERROR FILE');
        } else {
            const numToArr = numbersToArray(refactorData);
            const lines = getEveryLines(numToArr);
            const checkedNumbers = checkNumbers(lines);
            writeFile(checkedNumbers, filename)
                .then(() => {
                    resolve(checkedNumbers)
                })
                .catch(err => reject(err))
        }
    }))
}

module.exports = {scansFile};
