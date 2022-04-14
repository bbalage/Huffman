const ASCII_A = 65;
const ASCII_ZERO = 48;

class Huffman {

    constructor(inputText) {
        this.codeAbc = [];
        this.messageAbc = [];
        this.dispersion = [];
        this.#parseInputFileText(inputText);
        this.#orderMessageAbcAndDispersion();
        this.codeTree = new CodeTree(this.dispersion, this.codeAbc);
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
        console.log(output);
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
        const readObj = JSON.parse(inputText);
        console.log(Object.keys(readObj.dispersion));
        // TODO: Checks!
        this.#createCodeAbc(readObj.numberOfCodeAbcElements);
        // TODO: Checks!
        this.messageAbc = Object.keys(readObj.dispersion);
        for (let abcElement of this.messageAbc) {
            this.dispersion.push(readObj.dispersion[abcElement]);
        }
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
}

class CodeTree {

    /**
     * Constructs CodeTree
     * @param dispersion An ordered array of floating point numbers whose sum is 1.
     * @param codeAbc An array containing the code Abc.
     */
    constructor(dispersion, codeAbc) {
        this.nodes = [];
        this.branchingFactor = codeAbc.length;
        this.codeAbc = codeAbc;
        this.#buildSelf(dispersion);
    }

    getLeafCodes() {
        let leafCodes = [];
        for (let node of this.nodes) {
            if (!node.isLeaf) {
                break;
            }
            leafCodes.push(node.code);
        }
        return leafCodes;
    }

    #buildSelf(dispersion) {
        for (let prob of dispersion) {
            this.nodes.push({
                isLeaf: true,
                prob: prob,
                parent: undefined,
                children: undefined,
                code: []
            });
        }
        let currentIndices = Array.from({length: dispersion.length}, (x, i) => i);
        this.#mergeElements(currentIndices);
        this.#setCodes(this.nodes.at(-1), []);
    }

    #mergeElements(currentIndices) {
        console.log(currentIndices);
        let probSum = 0;
        const children = [];
        const loopStop = Math.min(currentIndices.length, this.branchingFactor);
        const newIndex = this.nodes.length;
        for (let i = 0; i < loopStop; i++) {
            const index = currentIndices.shift();
            probSum += this.nodes[index].prob;
            this.nodes[index].parent = newIndex;
            children.push(index);
        }
        this.nodes.push({
            isLeaf: false,
            prob: probSum,
            parent: undefined,
            children: children,
            code: undefined
        });
        this.#addIndexOrdered(currentIndices, newIndex);
        if (currentIndices.length <= 1) {
            return;
        }
        this.#mergeElements(currentIndices);
    }

    #setCodes(node, prevCodes) {
        if (node.isLeaf) {
            node.code = prevCodes;
            return;
        }
        for (let i in node.children) {
            let code = JSON.parse(JSON.stringify(prevCodes));
            code.push(this.codeAbc[i]);
            this.#setCodes(this.nodes[node.children[i]], code);
        }
    }

    #addIndexOrdered(currentIndices, newIndex) {
        for (let i in currentIndices) {
            if (this.nodes[currentIndices[i]].prob <= this.nodes[newIndex].prob) {
                currentIndices.splice(i + 1, 0, newIndex);
                break;
            }
        }
    }
}