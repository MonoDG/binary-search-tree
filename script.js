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
        this.#_array = this.removeDuplicates([...array].sort((a, b) => a - b));
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

    rebalance() {
        this.#_array = this.removeDuplicates(
            [...this.inOrder(this.#_root)].sort((a, b) => a - b)
        );
        this.#_root = this.buildTree(this.#_array, 0, this.#_array.length - 1);
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

// Take it all together
// 1. Create a binary search tree (BST) from an array of random numbers < 100.
//    You can create a function that returns an array of random numbers every
//    time you call it if you wish.
let myarray = Array(100)
    .fill()
    .map((_) => Math.floor(Math.random() * 100));
let bst = new Tree(myarray);
console.log("Initial Array");
console.log(myarray);
console.log("BST");
bst.prettyPrint(bst.root);
// 2. Confirm that the tree is balanced by calling isBalanced.
console.log(`Is balanced? ${bst.isBalanced(bst.root)}`);
// 3. Print out all elements in level, pre, post and in order.
console.log("Level Order");
console.log(bst.levelOrder());
console.log("Pre Order");
console.log(bst.preOrder(bst.root));
console.log("Post Order");
console.log(bst.postOrder(bst.root));
console.log("In Order");
console.log(bst.inOrder(bst.root));
// 4. Unbalance the tree by adding several numbers > 100.
console.log("Adding 105, 202, 154");
bst.insert(105);
bst.insert(202);
bst.insert(154);
bst.prettyPrint(bst.root);
// 5. Confirm that the tree is unbalanced by calling isBalanced.
console.log(`Is balanced? ${bst.isBalanced(bst.root)}`);
// 6. Balance the tree by calling rebalance.
console.log("Balancing tree");
bst.rebalance();
bst.prettyPrint(bst.root);
// 7. Confirm that the tree is balanced by calling isBalanced.
console.log(`Is balanced? ${bst.isBalanced(bst.root)}`);
// 8. Print out all elements in level, pre, post and in order.
console.log("Level Order");
console.log(bst.levelOrder());
console.log("Pre Order");
console.log(bst.preOrder(bst.root));
console.log("Post Order");
console.log(bst.postOrder(bst.root));
console.log("In Order");
console.log(bst.inOrder(bst.root));
