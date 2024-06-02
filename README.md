# Canvas to HTML Figma Plugin

This project is a Figma plugin that allows users to convert their Figma designs into HTML code. It's designed to help designers and developers streamline their workflow by automatically generating HTML code from Figma frames, text, rectangles, and vectors.

## Features

- **Frame Extraction**: Converts Figma frames into HTML sections with background colors and dimensions.
- **Text Support**: Extracts text elements from Figma and converts them into HTML paragraphs (`<p>` tags) with font styles, sizes, and colors.
- **Rectangle Conversion**: Transforms Figma rectangles into `<div>` elements with background colors, dimensions, and border radii.
- **SVG Support**: Converts Figma vector graphics into inline SVG elements for high-quality, scalable graphics in the HTML output.
- **Shadow and Opacity**: Handles shadows and opacity for elements to ensure visual fidelity in the HTML output.

## Getting Started

To use this plugin, follow these steps:

1. **Install Node.js and NPM**: Download Node.js from [https://nodejs.org/en/download/](https://nodejs.org/en/download/), which includes NPM (Node Package Manager) for installing dependencies.

2. **Install TypeScript**: Run `npm install -g typescript` to install TypeScript globally. TypeScript is used for writing the plugin code with type safety.

3. **Install Figma Plugin Typings**: Navigate to your plugin directory and run `npm install --save-dev @figma/plugin-typings` to get the latest type definitions for the Figma Plugin API.

4. **Compile TypeScript**: Open your plugin directory in Visual Studio Code, run the "Terminal > Run Build Task..." menu item, and select "npm: watch". This will compile your TypeScript code (`code.ts`) into JavaScript (`code.js`), which can be run by the browser.

## Usage

1. Open your Figma file and select the frames or elements you want to convert to HTML.
2. Run the plugin from the Figma menu.
3. The plugin UI will open, displaying options for converting your selected elements into HTML.
4. Click the "View" button to generate and download the HTML code.

## Contributing

Contributions are welcome! If you have ideas for improvements or have found a bug, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
