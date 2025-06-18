import { EventTarget } from "../eventtarget.js";
import { settings } from "../settings.js";
import { Vector2 } from "../vector2.js";

export class CartesianCoordinateSystemView extends EventTarget {

    constructor() {

        super();

        this.canvas = document.getElementById('cartesian-coordinate-system');
        this.context = this.canvas.getContext('2d');

        this.offsetX = this.canvas.width / 2;
        this.offsetY = this.canvas.height / 2;

        this.scale = 20;
        this.minScale = 2;
        this.maxScale = 200;

        this.pixelRatio = window.devicePixelRatio || 1;

        this.majorGridInterval = 1;
        this.minorGridInterval = 0.2;

        this.isDragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.previewVertexPosition = new Vector2();
        this.drawPreviewVertex = false;
        this.shapeClosed = false;

        this.vertices = {};

        this.setupHighDPI();
        this.setupEventListeners();
        this.updateGridIntervals();
        this.draw();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('contextmenu', (e) => this.handleRightClick(e));
        this.canvas.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.canvas.addEventListener('wheel', (e) => this.handleZoom(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    screenToWorld(screenX, screenY) {
        const x = (screenX - this.offsetX) / this.scale;
        const y = -(screenY - this.offsetY) / this.scale;
        return { x, y };
    }

    worldToScreen(worldX, worldY) {
        const x = worldX * this.scale + this.offsetX;
        const y = -worldY * this.scale + this.offsetY;
        return { x, y };
    }

    getMousePosition(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        return { x, y };
    }

    setupHighDPI() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.pixelRatio;
        this.canvas.height = rect.height * this.pixelRatio;
        this.context.scale(this.pixelRatio, this.pixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        this.offsetX = rect.width / 2;
        this.offsetY = rect.height / 2;
    }

    handleClick(e) {
        this.emit('click', this.previewVertexPosition);
    }

    handleRightClick(e) {
        e.preventDefault();
    }

    handleZoom(e) {

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = this.scale * zoomFactor;

        if (newScale >= this.minScale && newScale <= this.maxScale) {
            this.scale = newScale;

            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const worldBefore = this.screenToWorld(mouseX, mouseY);
            this.scale = newScale;
            const worldAfter = this.screenToWorld(mouseX, mouseY);

            this.offsetX += (worldAfter.x - worldBefore.x) * this.scale;
            this.offsetY -= (worldAfter.y - worldBefore.y) * this.scale;

            this.updateGridIntervals();
            this.draw();
            this.updateZoomInfo();
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;

            this.offsetX += deltaX;
            this.offsetY += deltaY;

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;

            this.draw();
        }

        const rect = this.canvas.getBoundingClientRect();
        this.previewVertex = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }

        let screenPos = this.getMousePosition(e.clientX, e.clientY);
        let worldPos = this.screenToWorld(screenPos.x, screenPos.y);
        this.updateMousePositionInfo(worldPos);
        this.emit('mouseMove', new Vector2(worldPos.x, worldPos.y));
    }

    handleMouseDown(e) {
        if (e.button === 1) {
            this.isDragging = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.canvas.style.cursor = 'grabbing';
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
        this.canvas.style.cursor = 'crosshair';
    }

    updateGridIntervals() {
        const pixelsPerUnit = this.scale;

        if (pixelsPerUnit >= 100) {
            this.majorGridInterval = 0.5;
            this.minorGridInterval = 0.1;
        } else if (pixelsPerUnit >= 50) {
            this.majorGridInterval = 1;
            this.minorGridInterval = 0.2;
        } else if (pixelsPerUnit >= 20) {
            this.majorGridInterval = 2;
            this.minorGridInterval = 0.5;
        } else if (pixelsPerUnit >= 10) {
            this.majorGridInterval = 5;
            this.minorGridInterval = 1;
        } else if (pixelsPerUnit >= 5) {
            this.majorGridInterval = 10;
            this.minorGridInterval = 2;
        } else {
            this.majorGridInterval = 20;
            this.minorGridInterval = 5;
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width / this.pixelRatio, this.canvas.height / this.pixelRatio);

        this.context.fillStyle = '#ffffff';
        this.context.fillRect(0, 0, this.canvas.width / this.pixelRatio, this.canvas.height / this.pixelRatio);

        this.drawGrid();
        this.drawAxes();

        if (this.drawPreviewVertex) {
            this.drawVertexPreview();
        }

        this.drawVertices();
    }

    drawGrid() {
        if (!settings.showGrid) return;

        const canvasWidth = this.canvas.width / this.pixelRatio;
        const canvasHeight = this.canvas.height / this.pixelRatio;

        const topLeft = this.screenToWorld(0, 0);
        const bottomRight = this.screenToWorld(canvasWidth, canvasHeight);

        this.context.strokeStyle = '#f0f0f0';
        this.context.lineWidth = 0.5;
        this.context.setLineDash([]);

        const minorStartX = Math.floor(topLeft.x / this.minorGridInterval) * this.minorGridInterval;
        const minorEndX = Math.ceil(bottomRight.x / this.minorGridInterval) * this.minorGridInterval;

        for (let x = minorStartX; x <= minorEndX; x += this.minorGridInterval) {
            if (Math.abs(x % this.majorGridInterval) > 0.001) {
                const screenX = this.worldToScreen(x, 0).x;
                this.context.beginPath();
                this.context.moveTo(screenX, 0);
                this.context.lineTo(screenX, canvasHeight);
                this.context.stroke();
            }
        }

        const minorStartY = Math.floor(bottomRight.y / this.minorGridInterval) * this.minorGridInterval;
        const minorEndY = Math.ceil(topLeft.y / this.minorGridInterval) * this.minorGridInterval;

        for (let y = minorStartY; y <= minorEndY; y += this.minorGridInterval) {
            if (Math.abs(y % this.majorGridInterval) > 0.001) {
                const screenY = this.worldToScreen(0, y).y;
                this.context.beginPath();
                this.context.moveTo(0, screenY);
                this.context.lineTo(canvasWidth, screenY);
                this.context.stroke();
            }
        }

        this.context.strokeStyle = '#d0d0d0';
        this.context.lineWidth = 1;

        const majorStartX = Math.floor(topLeft.x / this.majorGridInterval) * this.majorGridInterval;
        const majorEndX = Math.ceil(bottomRight.x / this.majorGridInterval) * this.majorGridInterval;

        for (let x = majorStartX; x <= majorEndX; x += this.majorGridInterval) {
            if (Math.abs(x) > 0.001) {
                const screenX = this.worldToScreen(x, 0).x;
                this.context.beginPath();
                this.context.moveTo(screenX, 0);
                this.context.lineTo(screenX, canvasHeight);
                this.context.stroke();
            }
        }

        const majorStartY = Math.floor(bottomRight.y / this.majorGridInterval) * this.majorGridInterval;
        const majorEndY = Math.ceil(topLeft.y / this.majorGridInterval) * this.majorGridInterval;

        for (let y = majorStartY; y <= majorEndY; y += this.majorGridInterval) {
            if (Math.abs(y) > 0.001) {
                const screenY = this.worldToScreen(0, y).y;
                this.context.beginPath();
                this.context.moveTo(0, screenY);
                this.context.lineTo(canvasWidth, screenY);
                this.context.stroke();
            }
        }
    }

    drawAxes() {
        const canvasWidth = this.canvas.width / this.pixelRatio;
        const canvasHeight = this.canvas.height / this.pixelRatio;

        this.context.strokeStyle = '#2c3e50';
        this.context.lineWidth = 2;
        this.context.setLineDash([]);

        const xAxisScreen = this.worldToScreen(0, 0).x;
        if (xAxisScreen >= 0 && xAxisScreen <= canvasWidth) {
            this.context.beginPath();
            this.context.moveTo(xAxisScreen, 0);
            this.context.lineTo(xAxisScreen, canvasHeight);
            this.context.stroke();
        }

        const yAxisScreen = this.worldToScreen(0, 0).y;
        if (yAxisScreen >= 0 && yAxisScreen <= canvasHeight) {
            this.context.beginPath();
            this.context.moveTo(0, yAxisScreen);
            this.context.lineTo(canvasWidth, yAxisScreen);
            this.context.stroke();
        }

        this.drawAxisLabels();
    }

    drawAxisLabels() {
        const canvasWidth = this.canvas.width / this.pixelRatio;
        const canvasHeight = this.canvas.height / this.pixelRatio;

        const topLeft = this.screenToWorld(0, 0);
        const bottomRight = this.screenToWorld(canvasWidth, canvasHeight);

        this.context.fillStyle = '#2c3e50';
        this.context.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';

        const yAxisScreenX = this.worldToScreen(0, 0).x;
        const xAxisScreenY = this.worldToScreen(0, 0).y;

        const labelStartX = Math.floor(topLeft.x / this.majorGridInterval) * this.majorGridInterval;
        const labelEndX = Math.ceil(bottomRight.x / this.majorGridInterval) * this.majorGridInterval;

        for (let x = labelStartX; x <= labelEndX; x += this.majorGridInterval) {
            if (Math.abs(x) > 0.001) {
                const screenX = this.worldToScreen(x, 0).x;
                if (screenX >= 10 && screenX <= canvasWidth - 10) {
                    const labelY = Math.min(xAxisScreenY + 15, canvasHeight - 5);
                    const labelText = this.formatNumber(x);
                    this.context.fillText(labelText, screenX, labelY);
                }
            }
        }

        this.context.textAlign = 'right';
        this.context.textBaseline = 'middle';

        const labelStartY = Math.floor(bottomRight.y / this.majorGridInterval) * this.majorGridInterval;
        const labelEndY = Math.ceil(topLeft.y / this.majorGridInterval) * this.majorGridInterval;

        for (let y = labelStartY; y <= labelEndY; y += this.majorGridInterval) {
            if (Math.abs(y) > 0.001) {
                const screenY = this.worldToScreen(0, y).y;
                if (screenY >= 10 && screenY <= canvasHeight - 10) {
                    const labelX = Math.max(yAxisScreenX - 8, 5);
                    const labelText = this.formatNumber(y);
                    this.context.fillText(labelText, labelX, screenY);
                }
            }
        }

        if (yAxisScreenX >= 15 && yAxisScreenX <= canvasWidth - 15 &&
            xAxisScreenY >= 15 && xAxisScreenY <= canvasHeight - 15) {
            this.context.textAlign = 'right';
            this.context.textBaseline = 'top';
            this.context.fillText('0', yAxisScreenX - 8, xAxisScreenY + 5);
        }
    }

    drawVertexPreview() {
        this.context.save();
        this.context.beginPath();
        const screenPosition = this.worldToScreen(this.previewVertexPosition.x, this.previewVertexPosition.y)
        this.context.arc(screenPosition.x, screenPosition.y, 6, 0, 2 * Math.PI);
        this.context.fillStyle = 'rgba(52, 152, 219, 0.4)';
        this.context.fill();
        this.context.restore();
    }

    drawVertices() {

        this.context.fillStyle = '#e74c3c';
        this.context.strokeStyle = '#3498db';
        this.context.lineWidth = 2;

        if (this.vertices.length > 0) {
            this.context.beginPath();
            const first = this.worldToScreen(this.vertices[0].x, this.vertices[0].y);
            this.context.moveTo(first.x, first.y);

            for (let i = 1; i < this.vertices.length; i++) {
                const screen = this.worldToScreen(this.vertices[i].x, this.vertices[i].y);
                this.context.lineTo(screen.x, screen.y);
            }

            if (this.shapeClosed && this.vertices.length > 2) {
                this.context.lineTo(first.x, first.y);
            }

            this.context.stroke();

            this.context.fillStyle = '#e74c3c';
            this.vertices.forEach(vertex => {
                const screen = this.worldToScreen(vertex.x, vertex.y);
                this.context.beginPath();
                this.context.arc(screen.x, screen.y, 4, 0, 2 * Math.PI);
                this.context.fill();
            });
        }
    }

    formatNumber(num) {
        if (Math.abs(num) < 0.001) return '0';
        if (Math.abs(num) >= 1000) return num.toExponential(1);
        if (Math.abs(num) >= 1) return num.toString();
        return num.toFixed(Math.max(0, -Math.floor(Math.log10(Math.abs(num)))));
    }

    updateZoomInfo() {
        const zoomPercent = Math.round((this.scale / 20) * 100);
        document.getElementById('zoomIndicator').textContent = `Zoom: ${zoomPercent}%`;
    }

    updateMousePositionInfo(worldPos) {
        let x = worldPos.x.toFixed(1);
        let y = worldPos.y.toFixed(1);
        document.getElementById('mouseCoords').textContent = `( ${x}, ${y} )`;
    }
}