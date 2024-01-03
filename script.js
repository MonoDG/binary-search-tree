class Node {
    #_data;
    #_left;
    #_right;

    constructor(data) {
        this.#_data = data;
        this.#_left = null;
        this.#_right = null;
    }

    get data() {
        return this.#_data;
    }

    get left() {
        return this.#_left;
    }

    get right() {
        return this.#_right;
    }

    set data(value) {
        this.#_data = value;
    }

    set left(value) {
        this.#_left = value;
    }

    set right(value) {
        this.#_right = value;
    }
}

class Tree {
    #_array;
    #_root;

    constructor(array) {
        this.#_array = [...array].sort();
        this.#_array = this.removeDuplicates(this.#_array);
        this.#_root = this.buildTree(this.#_array, 0, this.#_array.length - 1);
    }

    get root() {
        return this.#_root;
    }

    removeDuplicates(array) {
        let arrayWithoutDuplicates = [];
        let lastN = null;
        array.forEach((n) => {
            if (n !== lastN) {
                arrayWithoutDuplicates.push(n);
                lastN = n;
            }
        });
        return arrayWithoutDuplicates;
    }

    buildTree(array, start, end) {
        if (start > end) return null;
        let mid = Math.floor((start + end) / 2);
        let root = new Node(array[mid]);
        root.left = this.buildTree(array, start, mid - 1);
        root.right = this.buildTree(array, mid + 1, end);
        return root;
    }

    prettyPrint(node, prefix = "", isLeft = true) {
        if (node === null) return;
        if (node.right !== null)
            this.prettyPrint(
                node.right,
                `${prefix}${isLeft ? "│   " : "    "}`,
                false
            );
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
        if (node.left !== null)
            this.prettyPrint(
                node.left,
                `${prefix}${isLeft ? "    " : "│   "}`,
                true
            );
    }
}

const mytree = new Tree([2, 2, 5, 6, 1, 1, 0, 4]);
mytree.prettyPrint(mytree.root);
