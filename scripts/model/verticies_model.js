import { EventTarget } from "../eventtarget.js";
import { MathHelpers } from "../utils.js";

export class VerticiesModel extends EventTarget {
    constructor() {
        super();

        this.state = 'None';
        this.vertices = [];
        this.history = [];
        this.historyIndex = -1;
        this.shapeClosed = false;
        this.saveState();
    }

    clear() {
        this.vertices.length = 0;
        this.saveState();
        this.emit('onClear');
    }

    changeState(newState) {
        if (newState === this.state) return;
        this.state = newState;
        this.emit('onStateChaged', this.state);
    }

    addVertex(vertex) {
        const first = this.vertices[0];
        if (first && MathHelpers.isCloseTo(vertex.x, first.x, vertex.y, first.y)) {
            this.shapeClosed = true;
            this.saveState();
            this.emit('onShapedClosed');
            return;
        }

        this.vertices.push(vertex);
        this.saveState();
        this.emit('onVertexAdded');
    }

    createSquare() {
        this.clear();
        const coords = [
            { x: 0.5, y: 0.5 },
            { x: 0.5, y: -0.5 },
            { x: -0.5, y: -0.5 },
            { x: -0.5, y: 0.5 },
            { x: 0.5, y: 0.5 }
        ];

        coords.forEach(coord => {
            this.addVertex({
                ...coord,
                id: Date.now() + Math.random()
            });
        });
    }

    createTriangle() {
        this.clear();

        const coords = [
            { x: 0.0, y: 0.5 },
            { x: 0.5, y: -0.5 },
            { x: -0.5, y: -0.5 },
            { x: 0.0, y: 0.5 },
        ];

        coords.forEach(coord => {
            this.addVertex({
                ...coord,
                id: Date.now() + Math.random()
            });
        });
    }

    createCircle() {
        this.clear();
        const centerX = 0;
        const centerY = 0;
        const radius = 1;
        const segments = 20;

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * 2 * Math.PI;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            const vertex = {
                x: parseFloat(x.toFixed(3)),
                y: parseFloat(y.toFixed(3)),
                id: Date.now() + i
            };

            this.addVertex(vertex);
        }
    }

    saveState() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push({
            vertices: [...this.vertices]
        });
        this.historyIndex++;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const state = this.history[this.historyIndex];
            this.vertices = [...state.vertices];
            this.emit('onUndo');
            return true;
        }
        return false;
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const state = this.history[this.historyIndex];
            this.vertices = [...state.vertices];
            this.emit('onRedo');
            return true;
        }
        return false;
    }
}