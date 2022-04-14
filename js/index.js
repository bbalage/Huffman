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
    let codingTxt = "Generált kódolás:\n";
    for (let pair of huffman.getCoding()) {
        codingTxt += pair[0] + ": " + pair[1].join('') + "\n";
    }
    return "Kód ABC: "
        + huffman.getCodeAbc()
        + "\n\nÜzenet ABC és eloszlás:\n"
        + huffman.getMessageAbcWithDispersion()
        + '\n'
        + codingTxt
        + "\nEntrópia: "
        + huffman.getEntropy()
        + "\nÁtlagos kódhossz: "
        + huffman.getAvgCodeLength()
        + "\nHatásfok: "
        + huffman.getEfficiency();
}

function generateFileOutput() {
    const coding = huffman.getCodingTextified();
    return {
        "Entrópia": huffman.getEntropy(),
        "Hatásfok": huffman.getEfficiency(),
        "Kódolás": coding
    };
}

function download() {
    if (huffman === undefined) {
        alert("Nothing encoded yet! Upload a file to encode!");
        return;
    }
    const inputFilename = document.getElementById("inputFile").files[0].name;
    const outputFilename = inputFilename.split('.')[0] + "_out" + ".json";
    const fileContent = JSON.stringify(generateFileOutput(), null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
    element.setAttribute('download', outputFilename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}