export class CoordinateSystemSettings {
    constructor() {
        this.bold = false;
        this.showGrid = true;
    }
}

export class SnapSettings {

    constructor() {
        this.enabled = true;
        this.snapToGrid = true;
        this.gridSnapPrecision = 0.1;
    }
}

export class Settings {
    constructor() {
        this.coordinateSystemSettings = new CoordinateSystemSettings();
        this.snapSettings = new SnapSettings();
    }
}

export const settings = new Settings();