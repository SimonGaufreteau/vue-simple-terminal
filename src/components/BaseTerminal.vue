<template lang="en">
    <div class="vue-terminal font-display text-white  w-2/3" @click="switchFocus">
        <div class="terminal-header text-center bg-gray-700">
            Terminal
        </div>
        <div class="terminal-body text-left text-sm bg-black_primary">
            <div class="" v-for="(message, index) in messageList" :key="index">
                <div class="flex" v-if="!message.onlyOutput">
                    <div class="text-green-500 font-bold ">>&nbsp</div>
                    <div class="overflow-hidden break-words"> {{message.command}} </div>
                </div>
                <div v-for="(item, index) in message.result" :key="index" class="break-words"> 
                    {{item}} 
                </div>
            </div>
            <div class="terminal-last-line flex">
                <div class="text-blue-300 ">{{currentDirFormatted}} </div>
                <div class="text-green-500 font-bold">&nbsp>&nbsp</div>
                <div class=" break-words overflow-hidden whitespace-pre" v-html="inputCommand"></div>
                <input v-model="inputCommand" autofocus="true" ref="terminalInput" class="terminal-input bg-black_primary overflow-hidden  " @keyup="handleKeyPress($event)" placeholder=""/>
                <div class="terminal_cursor">&nbsp</div>
            </div>
        </div>

    </div>
    
</template>
<script>
import { TreeNode } from "../utils/tree.js";

export default {
    name: "BaseTerminal",
    data() {
        return {
            messageList: [],
            currentDir: null,
            inputCommand: "",
            commandHistory: [],
            availableCommands: {
                help: "Shows this tooltip",
                ls: "Lists all files present in the current directory",
                tree: "Shows the subdirectories as a tree view",
                "cat <filename>": "Print the content of <filename>",
                "cd <dir>": "Move to <dir>",
                "open <page>": "Opens the <page>",
                clear: "Clears the console"
            },
            treeDir: null
        };
    },
    computed: {
        currentDirFormatted() {
            if (this.currentDir == null) return "";
            var final_str = this.currentDir.value;
            var node = this.currentDir.parent;
            while (node != null) {
                final_str = node.value + "/" + final_str;
                node = node.parent;
            }
            //console.log(final_str);

            return final_str;
        }
    },
    mounted() {
        const help_res = this.getHelp();
        this.pushResultToMessageList(help_res);

        // Constructing Dir tree
        var dir0 = new TreeNode("~", true);
        var dir1 = new TreeNode("simon-gaufreteau", true);

        var dir2 = new TreeNode("Projects", true);
        const doc1 = new TreeNode("CV.html");
        const doc2 = new TreeNode("Home.html");
        const doc3 = new TreeNode("About.html");
        const doc4 = new TreeNode("discord-bot.py");
        const doc5 = new TreeNode("koa-vue.js");
        dir2.pushDescendant(doc4);
        dir2.pushDescendant(doc5);

        dir1.pushDescendant(dir2);
        dir1.pushDescendant(doc1);
        dir1.pushDescendant(doc2);
        dir1.pushDescendant(doc3);
        dir0.pushDescendant(dir1);
        this.treeDir = dir0;
        this.currentDir = dir1;
        console.log("Current dir");
        console.log(this.currentDir);

        this.treeDir.printTree();
    },
    methods: {
        pushCommandToMessageList(input, output) {
            this.messageList.push({
                onlyOutput: false,
                command: input,
                result: output
            });
        },
        pushResultToMessageList(message) {
            this.messageList.push({
                onlyOutput: true,
                command: "",
                result: message
            });
        },
        getHelp() {
            var tempResult = ["List of available commands : "];
            for (const prop in this.availableCommands) {
                tempResult.push("   - " + prop + " : " + this.availableCommands[prop]);
            }
            return tempResult;
        },
        clearConsole() {
            this.messageList = [];
        },
        changeDir() {
            const errorMessage = ["cd : Invalid directory."];
            var input = this.inputCommand.split(" ");
            if (input.length == 1) {
                return errorMessage;
            }
            var target = input[1].split("/");
            var i = 0;
            while (i < target.length) {
                switch (target[i]) {
                case "..":
                    if (this.currentDir.parent == null) {
                        return errorMessage;
                    }
                    this.currentDir = this.currentDir.parent;
                    break;

                case ".":
                    break;

                case "~":
                    this.currentDir = this.currentDir.getRoot();
                    break;

                default:
                    console.log(this.currentDir.descendants);
                    var index = -1;
                    for (let x = 0; x < this.currentDir.descendants.length; x++) {
                        console.log(this.currentDir.descendants[x].value + " / " + target[i]);
                        if (this.currentDir.descendants[x].value == target[i]) {
                            index = x;
                            break;
                        }
                    }

                    if (index >= 0 && this.currentDir.descendants[index].isDir) {
                        this.currentDir = this.currentDir.descendants[index];
                    } else {
                        errorMessage[0] += " (" + target[i] + ")";
                        return errorMessage;
                    }
                    break;
                }
                i++;
            }
        },

        handleKeyPress(e) {
            if (e.keyCode != 13) {
                return;
            }
            var res = [];

            switch (this.inputCommand.split(" ")[0]) {
            case "help":
                res = this.getHelp();
                break;
            case "clear":
                this.clearConsole();
                break;
            case "cd":
                res = this.changeDir();
                break;
            case "tree":
                //TODO : show tree
                break;
            case "":
                break;
            default:
                res.push("command not found : " + this.inputCommand);
                break;
            }
            if (this.inputCommand == "clear") {
                this.clearConsole();
                this.inputCommand = "";
                return;
            }
            console.log(res);
            this.pushCommandToMessageList(this.inputCommand, res);
            this.inputCommand = "";
        },
        switchFocus() {
            this.$refs.terminalInput.focus();
        }
    }
};
</script>
<style>
@keyframes blink {
    50% {
        visibility: hidden;
    }
}

@-webkit-keyframes blink {
    50% {
        visibility: hidden;
    }
}

.terminal_cursor {
    margin: 0;
    background-color: white;
    animation: blink 1s step-end infinite;
    -webkit-animation: blink 1s step-end infinite;
}

.terminal-input {
    position: relative;
    border: none;
    opacity: 0;
    width: 0;
    cursor: default;
}

.terminal-input:focus {
    outline: none;
    border: none;
}

.terminal-input-show {
    word-wrap: break-word;
}
</style>
