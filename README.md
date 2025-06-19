# Nulli

## 2D Vertex Generator

 **[Try it live at geonulli.com](https://geonulli.com)**

### Description
Nulli is a simple 2D vertex generator built for experimenting with geometric shapes on a coordinate system. It allows you to generate arrays of vertices, currently only exportable as C++ code.

The goal is to create shapes using normalized device coordinates, where coordinates should stay within |1.0| to remain visible in the rendering viewport (e.g., in OpenGL or Direct3D), i.e., |x| ≤ 1.0 and |y| ≤ 1.0.
And yes, of course, the coordinate system is larger than necessary for rendering in normalized device coordinates, where only values within |1.0| are visible.
This was a deliberate choice inspired by tools like GeoGebra, not strictly practical, but visually and conceptually satisfying.

The Editor supports 2 modes:
- FreeMode: Click on the canvas to place vertices and create custom shapes. When you click the first vertex again, the shape will automatically close.
- Predefined Shapes: Instantly generate basic shapes:
    - Square
    - Triangle
    - Circle

### How to use

Navigating the Coordinate System: Use the middle mouse button to drag (pan) the view, and scroll the mouse wheel to zoom in and out.

| Preview | Description |
|--------|-------------|
| ![PredefinedShapes](icons/shapes.svg) | **Shapes** - Opens a dropdown with three shapes: Square, Triangle, and Circle. Adds the corresponding shape to the canvas.|
| ![Predefined Square](icons/square.svg) | **Predefined Square** – Generates a square within normalized coordinates. |
| ![Predefined Triangle](icons/triangle.svg) | **Predefined Triangle** – Generates a triangle with normalized coordinates. |
| ![Predefined Circle](icons/circle.svg) | **Predefined Circle** – Generates a circle (approximatly, using a polygon with 20 segments) with normalized coordinates. |
| ![Free Mode](icons/freemode.svg) | **Free Mode** – Click to place vertices manually. Click the first point again to close the shape. |
| ![Clear](icons/clear.svg) | **Clear** – Clears the current vertices from the screen. |
| ![Code Export](icons/code.svg) | **Code Export** – Copies the current vertices as a C++ array to the clipboard. |
| ![Undo](icons/undo.svg) | **Undo** – Navigate your editing history. Some bugs may occur (work in progress!). |
| ![Redo](icons/redo.svg) | **Redo** – Navigate your editing history. Some bugs may occur (work in progress!). |
| ![Settings](icons/settings.svg) | **Settings** – Opens a panel with simple customization options |
