<template lang="en">
    <div class="vue-terminal "
    @click="switchFocus">
        <div class="terminal-header text-center bg-gray-700">
            Terminal
        </div>
        <div class="terminal-body" ref="terminalBody">
            <div class="py-0.5" v-for="(message, index) in messageList" :key="index">
                <div class="flex" v-if="!message.onlyOutput">
                    <div class="enter-char-format">{{enterChar}}&nbsp</div>
                    <div class="overflow-hidden break-words"> {{message.command}} </div>
                </div>
                <div v-for="(item, index) in message.result" :key="index" class="break-words">
                    {{item}}
                </div>
            </div>
            <div class="terminal-last-line flex">
                <div class="text-blue-500 ">{{currentDirFormatted}} </div>
                <div class="enter-char-format">&nbsp{{enterChar}}&nbsp</div>
                <div class=" break-words overflow-hidden whitespace-pre">{{inputCommand}}</div>
                <input
                v-model="inputCommand"
                autofocus="true"
                ref="terminalInput"
                class="terminal-input
                bg-black_primary overflow-hidden"
                @keyup="handleKeyPress($event)"
                placeholder=""/>
                <div class="terminal_cursor h-2 self-end">&nbsp</div>
            </div>
        </div>

    </div>

</template>
<script>
import { TreeNode } from '../utils/tree.js';

export default {
    name: 'BaseTerminal',
    data() {
        return {
            messageList: [],
            pagesList: [
                { name: 'CV.html', url: '/About' },
                { name: 'Home.html', url: '/Home' },
                { name: 'About.html', url: '/About' },
                { name: 'discord-bot.py', url: '/Article/88' },
                { name: 'vue.js', url: '/Home' },
            ],
            currentDir: null,
            inputCommand: '',
            enterChar: '❯',
            commandHistory: [],
            availableCommands: {
                help: 'Shows help for all commands',
                ls: 'Lists all files present in the current directory',
                tree: 'Shows the subdirectories as a tree view',
                cd: 'Move to <dir>',
                open: 'Opens the <page>',
                clear: 'Clears the console',
            },
            treeDir: null,
        };
    },
    computed: {
        currentDirFormatted() {
            if (this.currentDir == null) return '';
            let final_str = this.currentDir.value.name;
            let node = this.currentDir.parent;
            while (node != null) {
                final_str = `${node.value.name}/${final_str}`;
                node = node.parent;
            }
            return final_str;
        },
    },
    mounted() {
        const help_res = this.getHelp();
        this.pushResultToMessageList([help_res]);

        // Constructing Dir tree
        const dir0 = new TreeNode({ name: '~' }, true);
        const dir1 = new TreeNode({ name: 'simon-gaufreteau' }, true);

        const dir2 = new TreeNode({ name: 'Projects' }, true);
        const doc1 = new TreeNode({ name: 'CV.html', url: '/About' });
        const doc2 = new TreeNode({ name: 'Home.html', url: '/Home' });
        const doc3 = new TreeNode({ name: 'About.html', url: '/Home' });
        const doc4 = new TreeNode({ name: 'discord-bot.py', url: '/Article/88' });
        const doc5 = new TreeNode({ name: 'vue.js', url: '/Home' });
        dir2.pushDescendant(doc4);
        dir2.pushDescendant(doc5);

        dir1.pushDescendant(dir2);
        dir1.pushDescendant(doc1);
        dir1.pushDescendant(doc2);
        dir1.pushDescendant(doc3);
        dir0.pushDescendant(dir1);
        this.treeDir = dir0;
        this.currentDir = dir1;
    },
    methods: {
        pushCommandToMessageList(input, output) {
            this.messageList.push({
                onlyOutput: false,
                command: input,
                result: output,
            });
        },
        pushResultToMessageList(message) {
            this.messageList.push({
                onlyOutput: true,
                command: '',
                result: message,
            });
        },
        getHelp() {
            let tempResult = 'List of available commands : ';
            for (const prop in this.availableCommands) {
                tempResult += `\n   - ${prop} : ${this.availableCommands[prop]}`;
            }
            return tempResult;
        },
        clearConsole() {
            this.messageList = [];
        },
        changeDir() {
            let errorMessage = 'cd : Invalid directory.';
            const input = this.inputCommand.split(' ');
            if (input.length == 1) {
                return errorMessage;
            }
            const target = input[1].replace(/[\<\>]/g, '').split('/');
            let i = 0;
            while (i < target.length) {
                switch (target[i]) {
                case '..':
                    if (this.currentDir.parent == null) {
                        return errorMessage;
                    }
                    this.currentDir = this.currentDir.parent;
                    break;

                case '.':
                    break;

                case '~':
                    this.currentDir = this.currentDir.getRoot();
                    break;

                default:
                    var index = -1;
                    for (let x = 0; x < this.currentDir.descendants.length; x++) {
                        if (this.currentDir.descendants[x].value.name == target[i]) {
                            index = x;
                            break;
                        }
                    }

                    if (index >= 0 && this.currentDir.descendants[index].isDir) {
                        this.currentDir = this.currentDir.descendants[index];
                    } else {
                        errorMessage += ` (${target[i]})`;
                        return errorMessage;
                    }
                    break;
                }
                i++;
            }
        },

        showTree(node = this.currentDir, level = 0) {
            if (node == null) return;
            const hasDescendants = node.descendants.length > 0;
            this.pushResultToMessageList([
                ' '.repeat(level * 4) + node.value.name + (hasDescendants ? ': {' : ''),
            ]);
            if (hasDescendants) {
                for (const desc of node.descendants) {
                    this.showTree(desc, level + 1);
                }
                this.pushResultToMessageList([`${' '.repeat(level * 4)}}`]);
            }
        },

        showLS() {
            let final_str = '';
            if (this.currentDir.descendants.length > 0) {
                for (const desc of this.currentDir.descendants) {
                    let temp_value = desc.value.name;
                    if (desc.isDir) {
                        temp_value = `<${temp_value}>`;
                    }
                    final_str += `${temp_value}  `;
                }
            }
            return final_str;
        },

        openPage() {
            const errorMessage = 'open : Invalid page.';
            const input = this.inputCommand.split(' ');
            if (input.length === 1) {
                return errorMessage;
            }
            const foundpage = this.pagesList.filter((page) => {
                const pageNameInput = page.name.split('.');
                return (pageNameInput.length > 0 && input[1] === pageNameInput[0]) || input[1] === page.name;
            });
            if (foundpage.length >= 1) {
                this.$router.push(foundpage[0].url);
                return '';
            }
            return errorMessage;
        },

        showCommandHelp(cmd) {
            if (cmd in this.availableCommands) {
                return this.availableCommands[cmd];
            }
            return `Invalid command : ${cmd}.`;
        },

        handleKeyPress(e) {
            if (e.keyCode != 13) {
                return;
            }
            const res = [];
            let pushAfter = true;
            let switchCommand = true;

            const split_command = this.inputCommand.split(' ');
            if (
                split_command.length > 0
        && (split_command[1] == '--help' || split_command[1] == '-h')
            ) {
                res.push(this.showCommandHelp(split_command[0]));
                switchCommand = false;
            }
            if (switchCommand) {
                switch (this.inputCommand.split(' ')[0]) {
                case 'help':
                    res.push(this.getHelp());
                    break;
                case 'clear':
                    this.clearConsole();
                    break;
                case 'cd':
                    res.push(this.changeDir());
                    break;
                case 'tree':
                    var save_dir = this.currentDir;
                    pushAfter = false;
                    this.pushCommandToMessageList(this.inputCommand, '');
                    this.changeDir();
                    this.showTree();
                    this.currentDir = save_dir;
                    break;
                case 'ls':
                    res.push(this.showLS());
                    break;
                case 'open':
                    // TODO : ask to open the page
                    res.push(this.openPage());
                    break;
                case '':
                    break;
                default:
                    res.push(`command not found : ${this.inputCommand}`);
                    break;
                } // End of switch
            }
            if (this.inputCommand == 'clear') {
                this.clearConsole();
                pushAfter = false;
            }
            if (pushAfter) this.pushCommandToMessageList(this.inputCommand, res);
            this.inputCommand = '';
            this.scrollDown();
        },
        switchFocus() {
            this.$refs.terminalInput.focus();
        },
        scrollDown() {
            this.$nextTick(() => {
                this.$refs.terminalBody.scrollTop = this.$refs.terminalInput.offsetTop;
            });
        },
    },
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

.terminal-body {
  height: 500px;
  @apply text-left px-0.5 text-base text-gray-200 bg-black_primary whitespace-pre overflow-y-auto;
}

.vue-terminal {
  height: 600px;
  @apply font-display text-white bg-black_primary overflow-hidden  lg:w-2/3 h-full;
}

.enter-char-format {
  @apply text-green-600 font-bold;
}
</style>
