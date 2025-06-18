import { settings } from "../settings.js";

export class SettingsController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.model.on('onStateChaged', (newState) => this.onStateChanged(newState));

        this.view.on('onEnableSnappingClicked', isChecked => this.onEnableSnappingClicked(isChecked));
        this.view.on('onShowgridClicked', value => this.onShowgridClicked(value));
        this.view.on('onSettingsCloseBtn', () => this.onSettingsCloseBtn());
    }

    onStateChanged(newState) {
        this.view.onStateChanged(newState);
    }

    onEnableSnappingClicked(isChecked) {
        settings.enableSnapping = isChecked; 
    }
    
    onShowgridClicked(isChecked) {
        settings.showGrid = isChecked; 
    }

    onSettingsCloseBtn() {
        this.model.changeState('None');
    }
}