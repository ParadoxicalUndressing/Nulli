//Model
import { VerticiesModel } from './model/verticies_model.js';

// Views
import {CartesianCoordinateSystemView} from './view/ccs_view.js'
import { MenuView } from './view/menu_view.js';
import { SettingsView } from './view/settings_view.js';

//Controllers
import { CartesianCoordinateSystemController } from './controller/css_controller.js';
import { MenuController } from './controller/menu_controller.js';
import { SettingsController } from './controller/settings_controller.js'

class VertexGenerator {
    constructor() {
        this.verticiesModel = new VerticiesModel();

        this.cartesianCoordinateSystemView = new CartesianCoordinateSystemView();
        this.menuView = new MenuView();
        this.settingsView = new SettingsView();

        this.cartesianCoordinateSystemController = new CartesianCoordinateSystemController(this.verticiesModel, this.cartesianCoordinateSystemView);
        this.menuController = new MenuController(this.verticiesModel, this.menuView);
        this.settingsController = new SettingsController(this.verticiesModel, this.settingsView);

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