import { Vector2 } from '../vector2.js'
import { settings } from '../settings.js';

export class CartesianCoordinateSystemController {

    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.model.on('onStateChaged', (newState) => this.handleOnStateChanged(newState));
        this.model.on('onShapedClosed', () => this.handleOnShapeClosed());
        this.model.on('onVertexAdded', () => this.onVertexAdded());
        this.model.on('onClear', () => this.onClear());
        this.model.on('onUndo', () => this.onUndo());
        this.model.on('onRedo', () => this.onRedo());

        this.view.on('click', (position) => this.handleClick(position));
        this.view.on('mouseMove', (position) => this.handleMouseMove(position));
    }

    handleOnStateChanged(newState) {
        this.view.drawPreviewVertex = (newState === 'Free') ? true : false;
    }

    handleOnShapeClosed() {
        this.view.shapeClosed = true;

        if(this.model.state === 'Free') {
            this.model.changeState('None');
        }
    }

    onVertexAdded() {
        this.view.vertices = this.model.vertices;
    }

    onClear() {
        this.view.vertices.length = 0;
        this.view.shapeClosed = false;
    }

    onUndo() {
        this.view.vertices = this.model.vertices;
    }

    onRedo() {
        this.view.vertices = this.model.vertices;
    }

    handleClick(position) {
        if (this.model.state === 'Free') {
            this.model.addVertex(this.createVertex(position));
        }
    }

    handleMouseMove(position) {
        let finalPosition = position;
        if(settings.snapSettings.enabled) {
            finalPosition = this.applySnapping(position);
        }
        this.view.previewVertexPosition = finalPosition;
    }

    createVertex(position) {

        const vertex = {
            x: position.x,
            y: position.y,
            id: Date.now()
        };
        return vertex;
    }

    applySnapping(screenPos) {

        let bestSnap = screenPos;

        if (settings.snapSettings.snapToGrid) {

            const precision = settings.snapSettings.gridSnapPrecision;
            const gridSnapX = Math.round(screenPos.x / precision) * precision;
            const gridSnapY = Math.round(screenPos.y / precision) * precision;

            bestSnap = new Vector2(gridSnapX, gridSnapY);
        }
        return bestSnap;
    }
}