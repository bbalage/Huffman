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
        this.#mergeElements(currentIndices, false);
        this.#setCodes(this.nodes.at(-1), []);
    }

    #mergeElements(currentIndices, isNotFirst) {
        let probSum = 0;
        const children = [];
        const loopStop = this.#calcLoopStop(currentIndices.length, isNotFirst);
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
        if (currentIndices.length === 0) {
            return;
        }
        this.#addIndexOrdered(currentIndices, newIndex);
        this.#mergeElements(currentIndices, true);
    }

    #calcLoopStop(numberOfLeaves, isNotFirst) {
        if (isNotFirst || this.codeAbc.length === 2) {
            return this.branchingFactor;
        }
        else {
            const s = this.codeAbc.length;
            const x = numberOfLeaves % (s - 1);
            if (x === 1) {
                return s;
            } else if (x === 0) {
                return s - 1;
            } else {
                return x;
            }
        }
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
        if (this.nodes[newIndex].prob <= this.nodes[currentIndices[0]].prob) {
            currentIndices.unshift(newIndex);
            return;
        }
        for (let i = 0; i < currentIndices.length - 1; i++) {
            const ith_node = this.nodes[currentIndices[i]];
            const i_plus1th_node = this.nodes[currentIndices[i + 1]];
            if (ith_node.prob <= this.nodes[newIndex].prob && i_plus1th_node.prob >= this.nodes[newIndex].prob) {
                currentIndices.splice(i + 1, 0, newIndex);
                return;
            }
        }
        currentIndices.push(newIndex);
    }
}