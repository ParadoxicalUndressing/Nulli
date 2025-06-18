import { EventTarget } from "../eventtarget.js";
import { settings } from "../settings.js";

export class SettingsView extends EventTarget {
    constructor() {
        super();
        this.setupMenuEventListeners();

        document.getElementById('enablesnapping').checked = settings.enableSnapping;
        document.getElementById('showgrid').checked = settings.showGrid;
    }

    onStateChanged(newState) {
        if(newState === 'Settings') {
            document.getElementById('settingsContainer').classList.remove('hidden');
        }
        else {
            document.getElementById('settingsContainer').classList.add('hidden');
        }
    }

    setupMenuEventListeners() {
        document.getElementById('enablesnapping')?.addEventListener('click', () => this.onEnableSnappingClicked());
        document.getElementById('snappingprecision')?.addEventListener('click', () => this.onSnappingPrecisionClicked());
        document.getElementById('showgrid')?.addEventListener('click', () => this.onShowgridClicked());
        document.getElementById('settings-close-btn')?.addEventListener('click', () => this.onSettingsCloseBtn());
    }

    onEnableSnappingClicked() {
        const isChecked = document.getElementById("enablesnapping").checked;
        this.emit('onEnableSnappingClicked', isChecked);
    }

    onSnappingPrecisionClicked() {
        const precisionValue = 0.1;
        this.emit('onSnappingPrecisionClicked', precisionValue);
    }

    onShowgridClicked() {
        const isChecked = document.getElementById("showgrid").checked;
        this.emit('onShowgridClicked', isChecked);
    }

    onSettingsCloseBtn() {
        this.emit('onSettingsCloseBtn');
    }
}