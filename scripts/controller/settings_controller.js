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
        this.view.on('onSnappingPrecisionClicked', value => this.onSnappingPrecisionClicked(value));
        this.view.on('onShowgridClicked', value => this.onShowgridClicked(value));
        this.view.on('onSettingsCloseBtn', () => this.onSettingsCloseBtn());
    }

    onStateChanged(newState) {
        this.view.onStateChanged(newState);
    }

    onEnableSnappingClicked(isChecked) {
        settings.snapSettings.enabled = isChecked; 
    }

    onSnappingPrecisionClicked(precisionValue) {
        settings.snapSettings.precisionValue = 0.1; 
    }

    onShowgridClicked(isChecked) {
        settings.coordinateSystemSettings.showGrid = isChecked; 
    }

    onSettingsCloseBtn() {
        this.model.changeState('None');
    }
}