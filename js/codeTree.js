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