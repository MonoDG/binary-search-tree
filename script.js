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
        this.#_array = this.removeDuplicates([...array].sort());
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

    insert(value) {
        let currentNode = this.#_root;
        let lastNode = null;
        while (currentNode !== null) {
            if (value === currentNode.data) break;
            lastNode = currentNode;
            if (value < currentNode.data) currentNode = currentNode.left;
            else if (value > currentNode.data) currentNode = currentNode.right;
        }
        if (value < lastNode.data) lastNode.left = new Node(value);
        else if (value > lastNode.data) lastNode.right = new Node(value);
    }

    delete(value) {}

    levelOrder(callback = null) {
        let queue = [this.#_root];
        if (callback) {
            while (queue.length > 0) {
                let currentNode = queue.shift();
                callback(currentNode);
                if (currentNode.left !== null) queue.push(currentNode.left);
                if (currentNode.right !== null) queue.push(currentNode.right);
            }
        } else {
            let output = [];
            while (queue.length > 0) {
                let currentNode = queue.shift();
                output.push(currentNode.data);
                if (currentNode.left !== null) queue.push(currentNode.left);
                if (currentNode.right !== null) queue.push(currentNode.right);
            }
            return output;
        }
    }

    // TODO levelOrder recursive

    inOrder(node, callback = null) {
        if (node === null) return null;
        let output = [];
        let value = this.inOrder(node.left, callback);
        if (value) output = output.concat(value);
        if (callback) {
            callback(node);
        } else {
            output.push(node.data);
        }
        value = this.inOrder(node.right, callback);
        if (value) output = output.concat(value);
        return output;
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
// mytree.insert(3);
// mytree.insert(7);
// mytree.insert(7);
// mytree.prettyPrint(mytree.root);
// console.log(mytree.levelOrder());
// mytree.levelOrder(function (node) {
//     console.log(node.data * 2);
// });
console.log(mytree.inOrder(mytree.root));
mytree.inOrder(mytree.root, function (node) {
    node.data = node.data + "Hello";
});

mytree.prettyPrint(mytree.root);
