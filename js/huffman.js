const ASCII_A = 65;
const ASCII_ZERO = 48;

function sum_array(numeric_array) {
    let sum = 0;
    for (let num of numeric_array) {
        sum += num;
    }
    return sum;
}

class Huffman {

    constructor(inputText) {
        this.codeAbc = [];
        this.messageAbc = [];
        this.dispersion = [];
        this.#parseInputFileText(inputText);
        this.#orderMessageAbcAndDispersion();
        this.codeTree = new CodeTree(this.dispersion, this.codeAbc);
        console.log(this.codeTree.nodes);
        this.entropy = this.#calcEntropy();
        this.avgCodeLength = this.#calcAvgCodeLength();
        this.efficiency = this.#calcEfficiency();
    }

    getEntropy() {
        return this.entropy;
    }

    getAvgCodeLength() {
        return this.avgCodeLength;
    }

    getEfficiency() {
        return this.efficiency;
    }

    getCoding() {
        const codes = this.codeTree.getLeafCodes();
        return codes.map((e, i) => {
            return [this.messageAbc[i], e];
        });
    }

    getCodingTextified() {
        const codes = this.codeTree.getLeafCodes();
        const codesTextified = {};
        for (let i in codes) {
            codesTextified[this.messageAbc[i]] = codes[i].join('');
        }
        return codesTextified;
    }

    getCodeAbc() {
        return this.codeAbc;
    }

    getMessageAbcWithDispersion() {
        let output = "";
        for (let i = 0; i < this.messageAbc.length; i++) {
            output += this.messageAbc[i] + ": " + this.dispersion[i] + "\n";
        }
        return output;
    }

    #calcEntropy() {
        let entropy_tmp = 0;
        for (let prob of this.dispersion) {
            entropy_tmp += prob * Math.log2(prob);
        }
        return -1 * entropy_tmp;
    }

    #calcAvgCodeLength() {
        const codes = this.codeTree.getLeafCodes();
        let avgCodeLength = 0;
        for (let i in codes) {
            avgCodeLength += codes[i].length * this.dispersion[i];
        }
        return avgCodeLength;
    }

    #calcEfficiency() {
        return this.entropy / (this.avgCodeLength * Math.log2(this.codeAbc.length));
    }

    #parseInputFileText(inputText) {
        // TODO note: Program could be improved with more format checks about the input file.
        const readObj = JSON.parse(inputText);
        this.#createCodeAbc(readObj.numberOfCodeAbcElements);
        this.messageAbc = Object.keys(readObj.dispersion);
        for (let abcElement of this.messageAbc) {
            this.dispersion.push(readObj.dispersion[abcElement]);
        }
        // this.#checkIfDistributionSumIsOne();
        this.#orderMessageAbcAndDispersion();
    }

    #createCodeAbc(numberOfCodeAbcElements) {
        if (numberOfCodeAbcElements <= 10) {
            this.#createNumericCodeAbc(numberOfCodeAbcElements);
        } else {
            this.#createAlphabeticCodeAbc(numberOfCodeAbcElements);
        }

    }

    #createNumericCodeAbc(numberOfCodeAbcElements) {
        for (let i = 0; i < numberOfCodeAbcElements; i++) {
            this.codeAbc.push(String.fromCharCode(ASCII_ZERO + i));
        }
    }

    #createAlphabeticCodeAbc(numberOfCodeAbcElements) {
        for (let i = 0; i < numberOfCodeAbcElements; i++) {
            this.codeAbc.push(String.fromCharCode(ASCII_A + i));
        }
    }

    #orderMessageAbcAndDispersion() {
        for (let i = 0; i < this.messageAbc.length - 1; i++) {
            let minI = i;
            for (let j = i + 1; j < this.messageAbc.length; j++) {
                if (this.dispersion[j] < this.dispersion[minI]) {
                    minI = j;
                }
            }
            if (minI !== i) {
                let tmp = this.messageAbc[i];
                this.messageAbc[i] = this.messageAbc[minI];
                this.messageAbc[minI] = tmp;
                tmp = this.dispersion[i];
                this.dispersion[i] = this.dispersion[minI];
                this.dispersion[minI] = tmp;
            }
        }
    }

    #checkIfDistributionSumIsOne() {
        const sum = Number.parseFloat(sum_array(this.dispersion).toFixed(5));
        if (sum !== 1) {
            alert("Az eloszlás helytelen! A valószínűségek összege nem 1, hanem " + sum);
            throw Error("Incorrect dispersion! Sum of probabilities is not 1. It is: " + sum);
        }
    }
}