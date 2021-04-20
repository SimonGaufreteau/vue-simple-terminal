export class TreeNode {
    constructor(value, isDir = false) {
        this.value = value;
        this.parent = null;
        this.descendants = [];
        this.isDir = isDir;
    }

    pushDescendant(node) {
        if (!this.isDir) return;
        this.descendants.push(node);
        node.parent = this;
    }

    getRoot() {
        if (this.parent == null) return this;
        var node = this.parent;
        while (node.parent != null) {
            node = node.parent;
        }
        return node;
    }

    printTree(level = 0) {
        const hasDescendants = this.descendants.length > 0;
        console.log(" ".repeat(level * 4) + this.value + (hasDescendants ? ": {" : ""));

        if (hasDescendants) {
            for (const node of this.descendants) {
                node.printTree(level + 1);
            }
            console.log(" ".repeat(level * 4) + "}");
        }
    }
}
