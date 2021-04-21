# vue-terminal

## About

A simple vue component reproducing a standard linux terminal with a few commands.

Commands supported : 
- help 
- ls
- tree
- cd 
- clear

*Note : the 'open' command should be used to open the according page. Not supported in this project.*


## Stack

Vue v3 + Tailwindcss (can be replaced easily with standard css).

## Test the component

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Use the component

Import all files from ``` ./src ``` except ```App.vue``` which is just the container for the component.

Use ```<BaseTerminal />``` when you want to use the component.

The dir tree can be modified in ```mounted()``` in [BaseTerminal.vue](./src/components/BaseTerminal.vue). New commands can be added in ```data()``` and ```handleKeyPress(event)```.