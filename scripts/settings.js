
export class Settings {
    constructor() {
        this.enableSnapping = true;
        this.showGrid = true;
        this.gridSnapPrecision = 0.1;
    }
}

export const settings = new Settings();