import { EventTarget } from "../eventtarget.js";

export class MenuView extends EventTarget {
    constructor() {
        super();
        this.setupMenuEventListeners();
    }

    setupMenuEventListeners() {
        document.getElementById('shapes-btn').addEventListener('click', (e) => this.onShapesBtnClicked(e.currentTarget));
        document.getElementById('square-btn').addEventListener('click', () => this.onSquareBtnClicked());
        document.getElementById('triangle-btn').addEventListener('click', () => this.onTriangleBtnClicked());
        document.getElementById('circle-btn').addEventListener('click', () => this.onCircleBtnClicked());
        document.getElementById('freemode-btn').addEventListener('click', (e) => this.onFreeModeBtnClicked(e.currentTarget));
        document.getElementById('clear-btn').addEventListener('click', () => this.onClearBtnClicked());
        document.getElementById('undo-btn').addEventListener('click', () => this.onUndoBtnClicked());
        document.getElementById('redo-btn').addEventListener('click', () => this.onRedoBtnClicked());
        document.getElementById('code-btn').addEventListener('click', () => this.onCodeBtnClicked());
        document.getElementById('settings-btn').addEventListener('click', () => this.onSettingsBtnClicked());
    }

    onStateChanged(newState) {
        switch (newState) {
            case 'None':
                document.getElementById('freemode-btn').classList.remove('active');
                document.getElementById('shapes-btn').classList.remove('active');
                document.getElementById('shapes-btn').nextElementSibling.classList.remove('show');
                break;
            case 'Free':
                document.getElementById('shapes-btn').classList.remove('active');
                document.getElementById('freemode-btn').classList.add('active');
                document.getElementById('shapes-btn').nextElementSibling.classList.remove('show');
                break;
            case 'Shape':
                document.getElementById('freemode-btn').classList.remove('active');
                document.getElementById('shapes-btn').classList.add('active');
                document.getElementById('shapes-btn').nextElementSibling.classList.add('show');
                break;
            case 'Settings':
                document.getElementById('freemode-btn').classList.remove('active');
                document.getElementById('shapes-btn').classList.remove('active');
                
                break;
        }
    }

    onShapesBtnClicked(target) {
        this.emit('onShapeBtnClicked');
    }

    onSquareBtnClicked() {
        this.emit('onSquareBtnClicked');
    }

    onTriangleBtnClicked() {
        this.emit('onTriangleBtnClicked');
    }

    onCircleBtnClicked() {
        this.emit('onCircleBtnClicked');
    }

    onFreeModeBtnClicked(target) {
        this.emit('onFreeModeBtnClicked');
    }

    onClearBtnClicked() {
        this.emit('onClearBtnClicked');
    }

    onUndoBtnClicked() {
        this.emit('onUndoBtnClicked');
    }

    onRedoBtnClicked() {
        this.emit('onRedoBtnClicked');
    }

    onCodeBtnClicked() {
        this.emit('onCodeBtnClicked');
    }

    onSettingsBtnClicked() {
        this.emit('onSettingsBtnClicked');
    }
}