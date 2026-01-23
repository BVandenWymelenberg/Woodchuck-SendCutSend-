import { svgPathProperties } from "svg-path-properties";
import { svgPathBbox } from "svg-path-bbox";
import DxfParser from "dxf-parser";

export interface ParseResult {
  pathLengthInches: number;
  areaSquareInches: number;
  boundingBox: {
    width: number;
    height: number;
  };
}

// SVG default is 96 DPI (CSS pixels to inches)
const SVG_DPI = 96;

/**
 * Parse SVG content and calculate path length and bounding box area
 */
export function parseSVG(content: string): ParseResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "image/svg+xml");

  // Check for parsing errors
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid SVG file");
  }

  let totalLength = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Get all path elements
  const paths = doc.querySelectorAll("path");
  paths.forEach((path) => {
    const d = path.getAttribute("d");
    if (d) {
      try {
        // Calculate path length
        const pathProps = new svgPathProperties(d);
        totalLength += pathProps.getTotalLength();

        // Calculate bounding box
        const bbox = svgPathBbox(d);
        if (bbox && bbox.length === 4) {
          minX = Math.min(minX, bbox[0]);
          minY = Math.min(minY, bbox[1]);
          maxX = Math.max(maxX, bbox[2]);
          maxY = Math.max(maxY, bbox[3]);
        }
      } catch {
        // Skip malformed paths
      }
    }
  });

  // Handle other shape elements (rect, circle, ellipse, line, polyline, polygon)
  const rects = doc.querySelectorAll("rect");
  rects.forEach((rect) => {
    const x = parseFloat(rect.getAttribute("x") || "0");
    const y = parseFloat(rect.getAttribute("y") || "0");
    const width = parseFloat(rect.getAttribute("width") || "0");
    const height = parseFloat(rect.getAttribute("height") || "0");

    // Rectangle perimeter
    totalLength += 2 * (width + height);

    // Update bounding box
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  const circles = doc.querySelectorAll("circle");
  circles.forEach((circle) => {
    const cx = parseFloat(circle.getAttribute("cx") || "0");
    const cy = parseFloat(circle.getAttribute("cy") || "0");
    const r = parseFloat(circle.getAttribute("r") || "0");

    // Circle circumference
    totalLength += 2 * Math.PI * r;

    // Update bounding box
    minX = Math.min(minX, cx - r);
    minY = Math.min(minY, cy - r);
    maxX = Math.max(maxX, cx + r);
    maxY = Math.max(maxY, cy + r);
  });

  const ellipses = doc.querySelectorAll("ellipse");
  ellipses.forEach((ellipse) => {
    const cx = parseFloat(ellipse.getAttribute("cx") || "0");
    const cy = parseFloat(ellipse.getAttribute("cy") || "0");
    const rx = parseFloat(ellipse.getAttribute("rx") || "0");
    const ry = parseFloat(ellipse.getAttribute("ry") || "0");

    // Ellipse perimeter (approximation using Ramanujan's formula)
    const h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
    totalLength += Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

    // Update bounding box
    minX = Math.min(minX, cx - rx);
    minY = Math.min(minY, cy - ry);
    maxX = Math.max(maxX, cx + rx);
    maxY = Math.max(maxY, cy + ry);
  });

  const lines = doc.querySelectorAll("line");
  lines.forEach((line) => {
    const x1 = parseFloat(line.getAttribute("x1") || "0");
    const y1 = parseFloat(line.getAttribute("y1") || "0");
    const x2 = parseFloat(line.getAttribute("x2") || "0");
    const y2 = parseFloat(line.getAttribute("y2") || "0");

    // Line length
    totalLength += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Update bounding box
    minX = Math.min(minX, x1, x2);
    minY = Math.min(minY, y1, y2);
    maxX = Math.max(maxX, x1, x2);
    maxY = Math.max(maxY, y1, y2);
  });

  const polylines = doc.querySelectorAll("polyline");
  polylines.forEach((polyline) => {
    const points = parsePoints(polyline.getAttribute("points") || "");
    for (let i = 0; i < points.length - 1; i++) {
      totalLength += Math.sqrt(
        Math.pow(points[i + 1].x - points[i].x, 2) +
        Math.pow(points[i + 1].y - points[i].y, 2)
      );
    }
    points.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
  });

  const polygons = doc.querySelectorAll("polygon");
  polygons.forEach((polygon) => {
    const points = parsePoints(polygon.getAttribute("points") || "");
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      totalLength += Math.sqrt(
        Math.pow(points[next].x - points[i].x, 2) +
        Math.pow(points[next].y - points[i].y, 2)
      );
    }
    points.forEach((p) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
  });

  // Convert to inches (SVG units are CSS pixels at 96 DPI)
  const pathLengthInches = totalLength / SVG_DPI;

  // Calculate bounding box dimensions
  const width = minX === Infinity ? 0 : (maxX - minX) / SVG_DPI;
  const height = minY === Infinity ? 0 : (maxY - minY) / SVG_DPI;
  const areaSquareInches = width * height;

  return {
    pathLengthInches,
    areaSquareInches,
    boundingBox: { width, height },
  };
}

/**
 * Parse points attribute from polyline/polygon
 */
function parsePoints(pointsStr: string): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const coords = pointsStr.trim().split(/[\s,]+/);
  for (let i = 0; i < coords.length - 1; i += 2) {
    const x = parseFloat(coords[i]);
    const y = parseFloat(coords[i + 1]);
    if (!isNaN(x) && !isNaN(y)) {
      points.push({ x, y });
    }
  }
  return points;
}

/**
 * Parse DXF content and calculate path length and bounding box area
 */
export function parseDXF(content: string): ParseResult {
  const parser = new DxfParser();
  const dxf = parser.parseSync(content);

  if (!dxf || !dxf.entities) {
    throw new Error("Invalid DXF file");
  }

  let totalLength = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Process each entity
  for (const entity of dxf.entities) {
    switch (entity.type) {
      case "LINE": {
        const line = entity as unknown as { start: { x: number; y: number }; end: { x: number; y: number } };
        if (line.start && line.end) {
          totalLength += Math.sqrt(
            Math.pow(line.end.x - line.start.x, 2) +
            Math.pow(line.end.y - line.start.y, 2)
          );
          minX = Math.min(minX, line.start.x, line.end.x);
          minY = Math.min(minY, line.start.y, line.end.y);
          maxX = Math.max(maxX, line.start.x, line.end.x);
          maxY = Math.max(maxY, line.start.y, line.end.y);
        }
        break;
      }
      case "CIRCLE": {
        const circle = entity as unknown as { center: { x: number; y: number }; radius: number };
        if (circle.center && circle.radius) {
          totalLength += 2 * Math.PI * circle.radius;
          minX = Math.min(minX, circle.center.x - circle.radius);
          minY = Math.min(minY, circle.center.y - circle.radius);
          maxX = Math.max(maxX, circle.center.x + circle.radius);
          maxY = Math.max(maxY, circle.center.y + circle.radius);
        }
        break;
      }
      case "ARC": {
        const arc = entity as unknown as {
          center: { x: number; y: number };
          radius: number;
          startAngle: number;
          endAngle: number;
        };
        if (arc.center && arc.radius !== undefined) {
          // Calculate arc length
          let startAngle = arc.startAngle || 0;
          let endAngle = arc.endAngle || 360;

          // Convert to radians
          startAngle = (startAngle * Math.PI) / 180;
          endAngle = (endAngle * Math.PI) / 180;

          // Handle angle wrap-around
          let angleSpan = endAngle - startAngle;
          if (angleSpan < 0) angleSpan += 2 * Math.PI;

          totalLength += arc.radius * angleSpan;

          // Update bounding box (simplified - using full circle bounds)
          minX = Math.min(minX, arc.center.x - arc.radius);
          minY = Math.min(minY, arc.center.y - arc.radius);
          maxX = Math.max(maxX, arc.center.x + arc.radius);
          maxY = Math.max(maxY, arc.center.y + arc.radius);
        }
        break;
      }
      case "LWPOLYLINE":
      case "POLYLINE": {
        const polyline = entity as unknown as {
          vertices: Array<{ x: number; y: number; bulge?: number }>;
          shape?: boolean;
        };
        if (polyline.vertices && polyline.vertices.length > 0) {
          for (let i = 0; i < polyline.vertices.length; i++) {
            const vertex = polyline.vertices[i];
            minX = Math.min(minX, vertex.x);
            minY = Math.min(minY, vertex.y);
            maxX = Math.max(maxX, vertex.x);
            maxY = Math.max(maxY, vertex.y);

            // Calculate segment length
            if (i < polyline.vertices.length - 1) {
              const next = polyline.vertices[i + 1];
              if (vertex.bulge && vertex.bulge !== 0) {
                // Arc segment
                const arcLength = calculateBulgeArcLength(vertex, next, vertex.bulge);
                totalLength += arcLength;
              } else {
                // Straight segment
                totalLength += Math.sqrt(
                  Math.pow(next.x - vertex.x, 2) +
                  Math.pow(next.y - vertex.y, 2)
                );
              }
            }
          }
          // Handle closed polylines
          if (polyline.shape && polyline.vertices.length > 1) {
            const first = polyline.vertices[0];
            const last = polyline.vertices[polyline.vertices.length - 1];
            if (last.bulge && last.bulge !== 0) {
              totalLength += calculateBulgeArcLength(last, first, last.bulge);
            } else {
              totalLength += Math.sqrt(
                Math.pow(first.x - last.x, 2) +
                Math.pow(first.y - last.y, 2)
              );
            }
          }
        }
        break;
      }
      case "SPLINE": {
        // Splines are complex - approximate using control points
        const spline = entity as unknown as {
          controlPoints?: Array<{ x: number; y: number }>;
        };
        if (spline.controlPoints && spline.controlPoints.length > 1) {
          for (let i = 0; i < spline.controlPoints.length - 1; i++) {
            const current = spline.controlPoints[i];
            const next = spline.controlPoints[i + 1];
            totalLength += Math.sqrt(
              Math.pow(next.x - current.x, 2) +
              Math.pow(next.y - current.y, 2)
            );
            minX = Math.min(minX, current.x);
            minY = Math.min(minY, current.y);
            maxX = Math.max(maxX, current.x);
            maxY = Math.max(maxY, current.y);
          }
          // Include last point in bounding box
          const last = spline.controlPoints[spline.controlPoints.length - 1];
          minX = Math.min(minX, last.x);
          minY = Math.min(minY, last.y);
          maxX = Math.max(maxX, last.x);
          maxY = Math.max(maxY, last.y);
        }
        break;
      }
      case "ELLIPSE": {
        const ellipse = entity as unknown as {
          center: { x: number; y: number };
          majorAxisEndPoint: { x: number; y: number };
          axisRatio: number;
        };
        if (ellipse.center && ellipse.majorAxisEndPoint) {
          const rx = Math.sqrt(
            Math.pow(ellipse.majorAxisEndPoint.x, 2) +
            Math.pow(ellipse.majorAxisEndPoint.y, 2)
          );
          const ry = rx * (ellipse.axisRatio || 1);

          // Ellipse perimeter approximation
          const h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
          totalLength += Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

          // Update bounding box
          minX = Math.min(minX, ellipse.center.x - rx);
          minY = Math.min(minY, ellipse.center.y - ry);
          maxX = Math.max(maxX, ellipse.center.x + rx);
          maxY = Math.max(maxY, ellipse.center.y + ry);
        }
        break;
      }
    }
  }

  // DXF units are typically in inches (AutoCAD default)
  // Note: Some DXF files may use mm - a more robust solution would check $INSUNITS
  const width = minX === Infinity ? 0 : maxX - minX;
  const height = minY === Infinity ? 0 : maxY - minY;
  const areaSquareInches = width * height;

  return {
    pathLengthInches: totalLength,
    areaSquareInches,
    boundingBox: { width, height },
  };
}

/**
 * Calculate arc length for a bulge segment in a polyline
 */
function calculateBulgeArcLength(
  start: { x: number; y: number },
  end: { x: number; y: number },
  bulge: number
): number {
  const chordLength = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );
  const sagitta = Math.abs(bulge) * chordLength / 2;
  const radius = (chordLength * chordLength / 4 + sagitta * sagitta) / (2 * sagitta);
  const angle = 4 * Math.atan(Math.abs(bulge));
  return radius * angle;
}

/**
 * Main entry point - parse a file and return results
 */
export async function parseFile(file: File): Promise<ParseResult> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const content = await file.text();

  switch (extension) {
    case "svg":
      return parseSVG(content);
    case "dxf":
      return parseDXF(content);
    default:
      throw new Error(`Unsupported file type: .${extension}. Please upload SVG or DXF files.`);
  }
}
