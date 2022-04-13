const ASCII_A = 65;

function readFile(input) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        const readDataTextArea = document.getElementById("readData");
        const huffman = new Huffman(reader.result);
        readDataTextArea.innerText = generateInputAssessment(huffman);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

class Huffman {

    constructor(inputText) {
        this.codeAbc = [];
        this.messageAbc = [];
        this.dispersion = [];
        this.#parseInputFileText(inputText);
        this.#orderMessageAbcAndDispersion();
        this.codeTree = new CodeTree(this.dispersion, this.codeAbc);
    }

    getCoding() {
        const codes = this.codeTree.getLeafCodes();
        return codes.map((e, i) => {
            return [this.messageAbc[i], e];
        });
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

    #parseInputFileText(inputText) {
        const readObj = JSON.parse(inputText);
        console.log(Object.keys(readObj.dispersion));
        // TODO: Checks!
        this.#createCodeAbc(readObj);
        // TODO: Checks!
        this.messageAbc = Object.keys(readObj.dispersion);
        for (let abcElement of this.messageAbc) {
            this.dispersion.push(readObj.dispersion[abcElement]);
        }
        this.#orderMessageAbcAndDispersion();
    }

    #createCodeAbc(readObj) {
        for (let i = 0; i < readObj.numberOfCodeAbcElements; i++) {
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
            const index = currentIndeces.shift();
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
        if (currentIndices.length === 1) {
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
            this.#setCodes(node.children, code);
        }
    }
}

function generateInputAssessment(huffman) {
    let codingTxt = "";
    for (let pair of huffman.getCoding()) {
        codingTxt += pair[0] + ": " + pair[1] + "\n";
    }
    return "Kód ABC: " + huffman.getCodeAbc() + "\n\nÜzenet ABC és eloszlás:\n" + huffman.getMessageAbcWithDispersion() + codingTxt;
}