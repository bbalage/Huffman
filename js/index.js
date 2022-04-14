const ASCII_A = 65;
let huffman = undefined;

function readFile(input) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        const readDataTextArea = document.getElementById("readData");
        huffman = new Huffman(reader.result);
        readDataTextArea.innerText = generateInputAssessment(huffman);
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

function generateInputAssessment(huffman) {
    let codingTxt = "";
    for (let pair of huffman.getCoding()) {
        codingTxt += pair[0] + ": " + pair[1] + "\n";
    }
    return "Kód ABC: " + huffman.getCodeAbc() + "\n\nÜzenet ABC és eloszlás:\n" + huffman.getMessageAbcWithDispersion() + codingTxt;
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}