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
        this.parseInputFileText(inputText);
        this.orderedMessageAbcAndDispersion();

    }

    parseInputFileText(inputText) {
        const readObj = JSON.parse(inputText);
        console.log(Object.keys(readObj.dispersion));
        // TODO: Checks!
        this.#createCodeAbc(readObj);
        // TODO: Checks!
        this.messageAbc = Object.keys(readObj.dispersion);
        for (let abcElement of this.messageAbc) {
            this.dispersion.push(readObj.dispersion[abcElement]);
        }
        this.orderedMessageAbcAndDispersion();
    }

    #createCodeAbc(readObj) {
        for (let i = 0; i < readObj.numberOfElements; i++) {
            this.codeAbc.push(String.fromCharCode(ASCII_A + i));
        }
    }

    orderedMessageAbcAndDispersion() {
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
}

function generateInputAssessment(huffman) {
    return "Kód ABC: " + huffman.getCodeAbc() + "\n\nÜzenet ABC és eloszlás:\n" + huffman.getMessageAbcWithDispersion()
}