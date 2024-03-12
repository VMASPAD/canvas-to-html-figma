/* eslint-disable no-empty */
figma.showUI(__html__, { width: 900, height: 700 });

figma.ui.onmessage = (msg: { type: string; count: number }) => {
  function handleFrame() {
    const frames = figma.currentPage
      .findAll()
      .filter((node) => node.type === "FRAME");
    const createStylesFrameSection = frames.map((frame) => {
      // Asegúrate de que el nodo tiene una propiedad 'fills' y que no está vacía
      const fill =
        frame.fills && frame.fills.length > 0 ? frame.fills[0].color : null;
      const Opacity =
        frame.fills && frame.fills.length > 0 ? frame.fills[0].opacity : null;

      return {
        width: frame.width,
        height: frame.height,
        fill: fill
          ? `rgba(${fill.r * 255}, ${fill.g * 255}, ${
              fill.b * 255
            }, ${Opacity})`
          : "none",
      };
    });

    return createStylesFrameSection;
  }
  function handleText() {
    // Encuentra todos los nodos en la página actual
    const nodes = figma.currentPage.findAll();
    // Filtra los nodos para quedarte solo con los rectángulos
    const text = nodes.filter((node) => node.type === "TEXT");
    const colors = text.map((rectangle) => {
      // Asegúrate de que el rectángulo tenga un relleno y toma el primer relleno
      if (rectangle.fills && rectangle.fills.length > 0) {
        const fill = rectangle.fills[0];
        // Verifica si el relleno es del tipo 'SOLID' para obtener el color
        if (fill.type === "SOLID") {
          return fill.color; // Devuelve el objeto de color
        }
      }
    });
    const dataObjectDiv = [];
    for (let i = 0; i < text.length; i++) {
      dataObjectDiv.push({
        name: "p",
        font: text[i].fontName.family,
        type: text[i].fontName.style,
        text: text[i].characters,
        weight: text[i].fontWeight,
        size: text[i].fontSize,
        x: text[i].x,
        y: text[i].y,
        width: text[i].width,
        height: text[i].height,
        background: colors[i],
        opacity: text[i].fills[0].opacity === undefined ? 1 : 1,
      });
    }
    return dataObjectDiv;
  }
  function countRectangles() {
    // Encuentra todos los nodos en la página actual
    const nodes = figma.currentPage.findAll();
    // Filtra los nodos para quedarte solo con los rectángulos
    const rectangles = nodes.filter((node) => node.type === "RECTANGLE");
    const colors = rectangles.map((rectangle) => {
      // Asegúrate de que el rectángulo tenga un relleno y toma el primer relleno
      if (rectangle.fills && rectangle.fills.length > 0) {
        const fill = rectangle.fills[0];
        // Verifica si el relleno es del tipo 'SOLID' para obtener el color
        if (fill.type === "SOLID") {
          return fill.color; // Devuelve el objeto de color
        }
      }
    });

    const dataObjectDiv = [];
    for (let i = 0; i < rectangles.length; i++) {
      dataObjectDiv.push({
        name: "div",
        x: rectangles[i].x,
        y: rectangles[i].y,
        width: rectangles[i].width,
        height: rectangles[i].height,
        background: colors[i],
        opacity: rectangles[i].fills[0].opacity,
        borderRadius: rectangles[i].cornerRadius,
        colorShadow: rectangles[i].effects[0],
      });
    }
    return dataObjectDiv;
  }

  function getSVG() {
    const nodes = figma.currentPage.findAll();
    const vectors = nodes.filter(node => node.type === "VECTOR");
    const dataObjectDiv = [];
  
    for (let i = 0; i < vectors.length; i++) {
      let fill;
      if (vectors[i].fills && vectors[i].fills.length > 0) {
        fill = vectors[i].fills[0];
        if (fill.type !== "SOLID") {
          fill = null;
        }
      }
  
      let stroke;
      if (vectors[i].strokes && vectors[i].strokes.length > 0) {
        stroke = vectors[i].strokes[0];
        if (stroke.type !== "SOLID") {
          stroke = null;
        }
      }
  
      const paths = [];
      for (const path of vectors[i].vectorPaths) {
        let pathData = path.data;
        if (Array.isArray(path.data)) {
          pathData = path.data.join(" ");
        }
        paths.push(pathData);
      }
  
      dataObjectDiv.push({
        name: "svg",
        x: vectors[i].x,
        y: vectors[i].y,
        width: vectors[i].width,
        height: vectors[i].height,
        background: fill ? fill.color : null,
        opacity: fill ? fill.opacity : null,
        stroke: stroke ? stroke.color : null,
        strokeWeight: vectors[i].strokeWeight,
        vectorPaths: paths.join(" "),
      });
    }
  
    return dataObjectDiv;
  }
  if (msg.type === "start") {
    const object = countRectangles();
    const text = handleText();
    const firstObject = handleFrame();

    const createDiv = object
      .map((t) => {
        // Verificar si cada propiedad necesaria de 'colorShadow' está definida
        const shadowColor =
          t.colorShadow &&
          t.colorShadow.color &&
          t.colorShadow.offset &&
          t.colorShadow.radius !== undefined &&
          t.colorShadow.spread !== undefined
            ? `${t.colorShadow.offset.x}px ${t.colorShadow.offset.y}px ${
                t.colorShadow.radius
              }px ${t.colorShadow.spread}px rgb(${
                t.colorShadow.color.r * 255
              } ${t.colorShadow.color.g * 255} ${
                t.colorShadow.color.b * 255
              } / ${t.colorShadow.color.a})`
            : "0px 0px 0px 0px transparent";

        return `<${t.name} style="box-shadow: ${shadowColor};border-radius: ${
          t.borderRadius
        }px;height: ${t.height}px;width: ${
          t.width
        }px;position: absolute;left: ${t.x}px;top: ${t.y}px;background: rgb(${
          t.background.r * 255
        } ${t.background.g * 255} ${t.background.b * 255} / ${t.opacity});"></${
          t.name
        }>`;
      })
      .join("");

    const createP = text
      .map(
        (t) =>
          `<${t.name} style="margin:0;font-family: ${
            t.font
          }, sans-serif;font-size: ${t.size}px;font-weight: ${
            t.weight
          };height: ${t.height}px;width: ${
            t.width
          }px;position: absolute;left: ${t.x}px;top: ${t.y}px;color: rgb(${
            t.background.r * 255
          } ${t.background.g * 255} ${t.background.b * 255} / ${t.opacity});">${
            t.text
          }</${t.name}>`
      )
      .join("");
      const svgData = getSVG();

      const createSVG = svgData.map(svg => {
        // Convierte los colores de formato Figma (0-1) a formato CSS (0-255)
        const backgroundColor = svg.background ? `rgba(${Math.round(svg.background.r * 255)}, ${Math.round(svg.background.g * 255)}, ${Math.round(svg.background.b * 255)}, ${svg.opacity})` : 'none';
        const strokeColor = svg.stroke ? `rgba(${Math.round(svg.stroke.r * 255)}, ${Math.round(svg.stroke.g * 255)}, ${Math.round(svg.stroke.b * 255)}, 1)` : 'none';
       
        // Genera el código SVG
        return `
          <svg width="${svg.width}" height="${svg.height}" style="position: absolute; left: ${svg.x}px; top: ${svg.y}px;">
            <path d="${svg.vectorPaths}" fill="${backgroundColor}" stroke="${strokeColor}" stroke-width="${svg.strokeWeight}"/>
          </svg>
        `;
      }).join('');
    const createSection = `<section style="height: ${firstObject[0].height}px;width: ${firstObject[0].width}px;position: relative;background: ${firstObject[0].fill};">${createSVG}${createP}${createDiv}</section>`;
    figma.ui.postMessage({ type: "nodes", nodes: createSection });
  }
};
