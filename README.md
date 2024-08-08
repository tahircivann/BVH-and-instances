# Three.js BVH and Instanced Mesh Project

This project demonstrates the integration of the BVH (Bounding Volume Hierarchy) component with instanced meshes in Three.js. It includes custom stats for analyzing rendering quality and mesh details.

## YouTube Video Link of Project

https://www.youtube.com/watch?v=sRjJl_avdL8

## Overview

This project includes:
- **Three.js** for rendering 3D scenes.
- **three-mesh-bvh** for efficient raycasting and spatial queries.
- **stats.js** for monitoring performance (FPS).
- Custom stats panel for additional rendering information (vertices, triangles, geometries, textures, draw calls, programs, memory usage).

## Features

- **BVH Integration**: Efficient raycasting using BVH for multiple instances of box meshes.
- **Custom Stats Panel**: Displays detailed rendering stats, including the number of vertices, triangles, geometries, textures, draw calls, and memory usage.
- **Pointer Interaction**: A red box follows the mouse pointer and checks for intersections with instanced meshes.

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/threejs-bvh-test.git
    cd threejs-bvh-test
    ```

2. **Install the dependencies:**
    ```sh
    npm install
    ```

## Usage

1. **Start the development server:**
    ```sh
    npm run dev
    ```

2. **Open your browser and navigate to:**
    ```
    http://localhost:5173
    ```

3. **Interact with the scene:**
    - Move your mouse over the canvas. The red box will follow the pointer.
    - The custom stats panel on the right displays rendering information.

## Code Structure

- **main.js**: Main JavaScript file containing the Three.js setup, BVH integration, and custom stats logic.
- **index.html**: HTML file to load the script and render the canvas.

## Dependencies

- [Three.js](https://threejs.org/)
- [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh)
- [stats.js](https://github.com/mrdoob/stats.js/)

## Contributing

Feel free to submit issues or pull requests if you have any suggestions or improvements.
