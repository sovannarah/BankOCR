const digitHeight = 4;
const digitWidth = 3;
const numberOfDigit = 9;
const numberOfColumn = digitWidth * numberOfDigit;
const charValue = {
    "|": 1,
    "_": 0,
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
        line.push(charToDigit(char));
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
    console.log(numToArr)
}

module.exports = {scansFile};
