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

    constructor(array = []) {
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

    delete(value) {
        let currentNode = this.#_root;
        let lastNode = null;
        while (currentNode !== null) {
            if (value === currentNode.data) {
                if (currentNode.left !== null && currentNode.right !== null) {
                    let inOrderArrNodes = [];
                    this.inOrder(currentNode.right, function (node) {
                        inOrderArrNodes.push(node);
                    });
                    let inOrderSuccessor = inOrderArrNodes[0];
                    let tempCurrentNodeData = inOrderSuccessor.data;
                    this.delete(inOrderSuccessor.data);
                    currentNode.data = tempCurrentNodeData;
                    return;
                } else if (currentNode.left !== null) {
                    let tempCurrentNodeData = currentNode.left.data;
                    this.delete(currentNode.left.data);
                    currentNode.data = tempCurrentNodeData;
                    return;
                } else if (currentNode.right !== null) {
                    let tempCurrentNodeData = currentNode.right.data;
                    this.delete(currentNode.right.data);
                    currentNode.data = tempCurrentNodeData;
                    return;
                } else {
                    if (
                        lastNode.left &&
                        lastNode.left.data === currentNode.data
                    )
                        lastNode.left = null;
                    if (
                        lastNode.right &&
                        lastNode.right.data === currentNode.data
                    )
                        lastNode.right = null;
                    return;
                }
            }
            lastNode = currentNode;
            if (value < currentNode.data) currentNode = currentNode.left;
            else if (value > currentNode.data) currentNode = currentNode.right;
        }
    }

    find(value) {
        let currentNode = this.#_root;
        while (currentNode !== null) {
            if (value === currentNode.data) return currentNode;
            if (value < currentNode.data) currentNode = currentNode.left;
            else if (value > currentNode.data) currentNode = currentNode.right;
        }
        return null;
    }

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

    preOrder(node, callback = null) {
        if (node === null) return null;
        let output = [];
        if (callback) callback(node);
        else output.push(node.data);
        let value = this.preOrder(node.left, callback);
        if (value) output = output.concat(value);
        value = this.preOrder(node.right, callback);
        if (value) output = output.concat(value);
        return output;
    }

    postOrder(node, callback = null) {
        if (node === null) return null;
        let output = [];
        let value = this.postOrder(node.left, callback);
        if (value) output = output.concat(value);
        value = this.postOrder(node.right, callback);
        if (value) output = output.concat(value);
        if (callback) callback(node);
        else output.push(node.data);
        return output;
    }

    height(node) {
        if (node === null) return -1;
        let leftTreeHeight = this.height(node.left);
        let rightTreeHeight = this.height(node.right);
        return Math.max(leftTreeHeight, rightTreeHeight) + 1;
    }

    depth(node) {
        return this.height(this.root) - this.height(node);
    }

    isBalanced(node) {
        let output = true;
        this.preOrder(node, (node) => {
            let leftHeight = this.height(node.left);
            let rightHeight = this.height(node.right);
            if (Math.abs(leftHeight - rightHeight) > 1) {
                output = false;
            }
        });
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

const mytree = new Tree([1, 2, 3, 4, 5, 6, 7]);
// mytree.insert(3);
// mytree.insert(7);
// mytree.insert(7);
// mytree.prettyPrint(mytree.root);
// console.log(mytree.levelOrder());
// mytree.levelOrder(function (node) {
//     console.log(node.data * 2);
// });
// console.log(mytree.inOrder(mytree.root));
// mytree.inOrder(mytree.root, function (node) {
//     node.data = node.data + "Hello";
// });

// mytree.prettyPrint(mytree.root);

// console.log(mytree.preOrder(mytree.root));
// mytree.preOrder(mytree.root, function (node) {
//     node.data = node.data * 2;
// });

// mytree.prettyPrint(mytree.root);

// console.log(mytree.postOrder(mytree.root));
// mytree.postOrder(mytree.root, function (node) {
//     node.data = node.data * 2;
// });

// mytree.prettyPrint(mytree.root);

// console.log(mytree.find(6));

// mytree.delete(2);
// mytree.prettyPrint(mytree.root);
// mytree.delete(4);
// mytree.prettyPrint(mytree.root);
// mytree.delete(5);
// mytree.prettyPrint(mytree.root);
// mytree.delete(0);
// mytree.prettyPrint(mytree.root);
mytree.insert(8);
mytree.prettyPrint(mytree.root);
console.log(mytree.height(mytree.root)); // 4
console.log(mytree.depth(mytree.root.right.right)); // 7
console.log(mytree.isBalanced(mytree.root));
mytree.insert(9);
mytree.prettyPrint(mytree.root);
console.log(mytree.isBalanced(mytree.root));
