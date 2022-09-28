export function generateVertices({
  numVerticalPoints = 3,
  height,
  width,
  zPosition
}) {
  const squareSize = height / numVerticalPoints;
  const numHorizontalPoints = Math.floor(width / squareSize);
  const planeWidth = numHorizontalPoints * squareSize;

  const count = numVerticalPoints * numHorizontalPoints;
  const positions = new Float32Array(count * 3);

  // Place all verts:
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = i3 + 0;
    const y = i3 + 1;
    const z = i3 + 2;

    // get index
    positions[x] = i % numHorizontalPoints;
    // position in 0 -> planeWidth
    positions[x] *= squareSize;
    // translate to -0.5planeWidth -> 0.5planeWidth
    positions[x] -= planeWidth * 0.5;
    // move all points to center of step
    positions[x] += squareSize * 0.5;

    // get index
    positions[y] = Math.floor(i / numHorizontalPoints);
    // position in 0 -> height
    positions[y] *= squareSize;
    // translate to -0.5height -> 0.5height
    positions[y] -= height * 0.5;
    // move all points to center of step
    positions[y] += squareSize * 0.5;

    positions[z] = zPosition;
  }

  return positions;
}
