import { codeExportService } from "../Services/codeexportservice.js";

export class MenuController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.setupEventListeners();
    }

    setupEventListeners() {

        this.model.on('onStateChaged', (newState) => this.onStateChanged(newState));

        this.view.on('onShapeBtnClicked', () => this.onShapeBtnClicked());
        this.view.on('onSquareBtnClicked', () => this.onSquareBtnClicked());
        this.view.on('onTriangleBtnClicked', () => this.onTriangleBtnClicked());
        this.view.on('onCircleBtnClicked', () => this.onCircleBtnClicked());
        this.view.on('onFreeModeBtnClicked', () => this.onFreeModeClicked());
        this.view.on('onClearBtnClicked', () => this.onClearBtnClicked());

        this.view.on('onUndoBtnClicked', () => this.onUndoBtnClicked());
        this.view.on('onRedoBtnClicked', () => this.onRedoBtnClicked());
        this.view.on('onCodeBtnClicked', () => this.onCodeBtnClicked());
        this.view.on('onSettingsBtnClicked', () => this.onSettingsBtnClicked());
    }

    onStateChanged(newState) {
        this.view.onStateChanged(newState);
    }

    onShapeBtnClicked() {
        switch (this.model.state) {
            case 'None':
            case 'Free':
                this.model.changeState('Shape');
                break;
            case 'Shape':
                this.model.changeState('None');
                break;
        }
    }

    onSquareBtnClicked() {
        this.model.createSquare();
    }

    onTriangleBtnClicked() {
        this.model.createTriangle();
    }

    onCircleBtnClicked() {
        this.model.createCircle();
    }

    onFreeModeClicked() {
        switch (this.model.state) {
            case 'None':
            case 'Shape':
                this.model.changeState('Free');
                break;
            case 'Free':
                this.model.changeState('None');
                break;
        }
    }

    onClearBtnClicked() {
        this.model.clear();
    }

    onUndoBtnClicked() {
        this.model.undo();
    }

    onRedoBtnClicked() {
        this.model.redo();
    }

    onCodeBtnClicked() {
        const code = codeExportService.generateCppCode(this.model.vertices);
        navigator.clipboard.writeText(code).then(() => {
            alert('C++ code copied to clipboard!');
        });
    }

    onSettingsBtnClicked() {

    }
}