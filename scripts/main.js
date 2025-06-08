// Views
import {CartesianCoordinateSystemView} from './view/ccs_view.js'
import { MenuView } from './view/menu_view.js';

//Controllers
import { CartesianCoordinateSystemController } from './controller/css_controller.js';
import { MenuController } from './controller/menu_controller.js';

//Model
import { VerticiesModel } from './model/verticies_model.js';

class VertexGenerator {
    constructor() {
        this.cartesianCoordinateSystemView = new CartesianCoordinateSystemView();
        this.menuView = new MenuView();

        this.verticiesModel = new VerticiesModel();

        this.cartesianCoordinateSystemController = new CartesianCoordinateSystemController(this.verticiesModel, this.cartesianCoordinateSystemView);
        this.menuController = new MenuController(this.verticiesModel, this.menuView);

        this.setupRenderLoop();
    }

    setupRenderLoop() {
        const render = () => {
            this.cartesianCoordinateSystemView.draw();
            requestAnimationFrame(render);
        };
        render();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.vertexGenerator = new VertexGenerator();
});