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
            <div class="terminal-last-line flex flex-shrink-0">
                <div class="text-blue-300 ">~/simon-gaufreteau </div>
                <div class="text-green-500 font-bold">&nbsp>&nbsp</div>
                <div class=" break-words overflow-hidden" v-html="inputCommand"></div>
                <input v-model="inputCommand" autofocus="true" ref="terminalInput" class="terminal-input bg-black_primary overflow-hidden  " @keyup="handleKeyPress($event)" placeholder=""/>
                <div class="terminal_cursor">&nbsp</div>
            </div>
        </div>

    </div>
    
</template>
<script>
export default {
    name: "BaseTerminal",
    data() {
        return {
            messageList: [],
            inputCommand: "",
            commandHistory: [],
            availableCommands: {
                help: "Shows this tooltip",
                ls: "Lists all files present in the current directory",
                "cat <filename>": "Print the content of <filename>",
                "cd <dir>": "Move to <dir>",
                "open <page>": "Opens the <page>",
                clear: "Clears the console",
            },
        };
    },
    mounted() {
        const help_res = this.getHelp();
        this.pushResultToMessageList(help_res);
    },
    methods: {
        pushCommandToMessageList(input, output, isOutput) {
            this.messageList.push({
                onlyOutput: isOutput,
                command: input,
                result: output,
            });
        },
        pushResultToMessageList(message) {
            this.messageList.push({
                onlyOutput: true,
                command: "",
                result: message,
            });
        },
        getHelp() {
            var tempResult = ["List of available commands : "];
            for (const prop in this.availableCommands) {
                tempResult.push(
                    "   - " + prop + " : " + this.availableCommands[prop]
                );
            }
            return tempResult;
        },
        clearConsole() {
            this.messageList = [];
        },

        handleKeyPress(e) {
            if (e.keyCode != 13) {
                return;
            }
            var res = [];

            switch (this.inputCommand) {
                case "help":
                    res = this.getHelp();
                    break;
                case "clear":
                    this.clearConsole();
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
            this.pushCommandToMessageList(this.inputCommand, res, false);
            this.inputCommand = "";
        },
        switchFocus() {
            this.$refs.terminalInput.focus();
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
</style>