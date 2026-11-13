import { TegakiEngine } from 'tegaki/core';
// import bundle from 'tegaki/fonts/caveat';
import bundle from 'tegaki/fonts/tangerine';

const KEY_1 = 'œ';
const KEY_2 = '∑';
const KEY_3 = '´';
const KEY_4 = '®';

const speed = 1;

const container = document.getElementById('handwriting');
const input = document.getElementById('input');
const body = document.body;

let isMenuShowing = false;
const menu = document.getElementById('menu');
const menu1 = document.getElementById('menu-play-poem');
const menu2 = document.getElementById('menu-read-crystal');
const menu3 = document.getElementById('menu-save-crystal');
const menu4 = document.getElementById('menu-clear poem');

input.focus();

let text = '';

const engine = new TegakiEngine(container, {
    text,
    font: bundle,
    time: { mode: 'uncontrolled', speed, loop: false },
    onComplete: onTextWriteComplete
});

let poem;

// scroll logic
const scroller = document.getElementById('scroller');
const content = document.getElementById('content');

const ro = new ResizeObserver(() => {
  scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
});
ro.observe(content);

// keep input focused
body.addEventListener('click', () => {
    input.focus();
})
input.addEventListener('blur', () => {
    input.focus();
});

input.addEventListener('keyup', (event) => {
    // console.log('event', event.target.value)
    // console.log('input', event.key)
    if(event.key === 'Enter'){
        text += `\n ${event.target.value}`
        engine.update({text})
        // engine.update({text: event.target.value})
        input.value = '';

        scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
    }

    if(event.key === 'Alt'){
        isMenuShowing = false;
        hideMenu();
    }
});

// modifider menu logic
input.addEventListener('keydown', (event => {
    const key = event.key;

    console.log('keydown key', event)

    if(key === 'Alt'){
        isMenuShowing = true;
        showMenu();
    }

    if(key === KEY_1){
        event.preventDefault();
        runCommand('1')
    }
    if(key === KEY_2){
        event.preventDefault();
        runCommand('2')
    }
    if(key === KEY_3){
        event.preventDefault();
        runCommand('3')
    }
    if(key === KEY_4){
        event.preventDefault();
        runCommand('4')
    }
}));

function showMenu(){
    menu.classList.add('show-menu');
}

function hideMenu(){
    menu.classList.remove('show-menu');
}

function runCommand(command){
    if(!isMenuShowing) return;

    input.value = '';

    switch(command){
        case '1':
            playPoem();
            break;
        case '2':
            readCrystal();
            break;
        case '3':
            saveToCrystal();
            break;
        case '4':
            clearPoem();
            break;
    }
}

async function playPoem(){
    const response = await fetch('/api/list');
    const data = await response.json();

    console.log('response', data);
    const num = randomIntFromInterval(0, data.poems.length - 1);
    const poem = data.poems[num];

    playbackPoem(poem.poemArray);
}

async function readCrystal(){
    // update this when readCrystal functionality is implemented
    playPoem();


    // DEBUG
    // playbackPoem(['line 1', 'line 2', 'line 3'])
}

async function saveToCrystal(){
    const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            filename: 'list.txt',
            lines: ['apple', 'banana', 'cherry'],
        }),
    });

    if (!response.ok) throw new Error(`Save failed: ${response.status}`);
    const result = await response.json();
    console.log('saved poem', result)
}

function clearPoem(){
    text = '';
    engine.update({text})
    input.value = '';
}

let count = 0;
let isPlayingBack = false;
function playbackPoem(poemArray){
    isPlayingBack = true;
    poem = poemArray;

    // grab the first line, play it
    let nextLine = poem[count];

    if(nextLine){
        text += `${nextLine} \n`
        engine.update({text});
    } else {
        isPlayingBack = false;
        console.error('you have done it now')
    }
}

function onTextWriteComplete(){
    // console.log('text complete', count, poem.length);

    if(isPlayingBack){
        count++;
    
        if(count <= poem.length){
            let nextLine = poem[count];
    
            if(nextLine){
                text += `${nextLine} \n`
                engine.update({text});
                scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
            } else {
                isPlayingBack = false;
                console.log('poem done')
            }
        } else {
            isPlayingBack = false;
            console.error('you have done it now from inside the loop')
        }
    }
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}