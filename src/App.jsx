import { OrbitControls } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"

const solarFrameData = {
  "panels": [
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: true},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
    {hasError: false},
  ]
}

function App() {
  const [frameLength, setFrameLength] = useState (50)
  const [frameBreadth, setFrameBreadth] = useState (50)
  const [frameHeight, setFrameHeight] = useState (5)
  const [panelLength, setPanelLength] = useState (10)
  const [panelBreadth, setPanelBreadth] = useState (10)
  const [panelHeight, setPanelHeight] = useState (3)
  const [heightFromGround, setHeightFromGround] = useState (3)
  const [sunIntensity, setSunIntensity] = useState (25)

  const Sun = ({ radius, time, intensity }) => {
      const lightRef = useRef();
      const sphereRef = useRef();

      useFrame(({ clock }) => {
          const elapsedTime = clock.getElapsedTime();

          const angularSpeed = (2 * Math.PI) / time;

          const angle = elapsedTime * angularSpeed;

          const x = radius * Math.cos(angle);
          const y = 0;
          const z = radius * Math.sin(angle);

          lightRef.current.position.set(x, y, z);
          sphereRef.current.position.set(x, y, z);
      });

      return (
        <>
          <mesh ref={sphereRef} position={[radius, 0, 0]}>
            <sphereGeometry args={[20, 20, 20]} />
            <meshStandardMaterial
              color="yellow"
              emissive="yellow"
              transparent={true}
              opacity={0.6}
              roughness={0.1}
              metalness={0.5}
            />
          </mesh>
          <directionalLight
            ref={lightRef}
            color="white"
            intensity={intensity}
            position={[50, 100, 50]}
            castShadow={true}
          />
        </>
      );
  }

  const GlassSurface = ({ length, breadth, height }) => {
    return (
      <mesh position={[0, 0, 5]}>
        <boxGeometry args={[length, breadth, height]}>
          <meshStandardMaterial
            transparent={true}
            opacity={0.3}
            color="lightblue"
            roughness={0.1}
            metalness={0.5}
          />
        </boxGeometry>
      </mesh>
    );
  };

  const Panel = ({ position, dimensions, hasError = false }) => {
    return (
      <mesh position={position}>
          <boxGeometry  args={dimensions} />
          <meshStandardMaterial color={hasError ? "#ff6666" : "#0033cc"} />
      </mesh>
    )
  }

  const SolarFrame = ({
    frameDimensions = [5, 5, 5],
    panelDimensions = [1, 1, 0.2],
    panelCount = 6,
  }) => {
    const [length, breadth] = frameDimensions; // We only use X (length) and Y (breadth) for panel placement
    const [panelLength, panelBreadth, panelHeight] = panelDimensions; // Only using X and Y for panel size
  
    // Calculate how many panels fit along each axis based on the panel dimensions
    const columns = Math.floor(length / panelLength); // Number of panels that fit along X-axis (length)
    const rows = Math.floor(breadth / panelBreadth); // Number of panels that fit along Y-axis (breadth)
  
    // Ensure total panels do not exceed panelCount
    const totalPanels = Math.min(columns * rows, panelCount);
  
    const panels = [];
    let panelIndex = 0;

    // Introduce a gap between panels (adjust this value as needed)
    const gap = 1;

    // Calculate total available space for panels (subtract gaps)
    const totalAvailableLength = length - (columns - 1) * gap;
    const totalAvailableBreadth = breadth - (rows - 1) * gap;

    // Adjust panel size with respect to the available space
    const adjustedPanelLength = totalAvailableLength / columns;
    const adjustedPanelBreadth = totalAvailableBreadth / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (panelIndex >= totalPanels) break;

        // Calculate the panel position for each panel inside the cuboid
        const xPos = col * (adjustedPanelLength + gap) - length / 2 + adjustedPanelLength / 2;
        const yPos = row * (adjustedPanelBreadth + gap) - breadth / 2 + adjustedPanelBreadth / 2;
        const zPos = 0.5; // Fixed Z position to avoid layering

        panels.push(
          <Panel
            key={panelIndex}
            position={[xPos, yPos, zPos]}
            dimensions={[adjustedPanelLength, adjustedPanelBreadth, panelHeight]} // Adjusted panel dimensions
            hasError={solarFrameData.panels[panelIndex].hasError} // Use your panel data here
          />
        );

        panelIndex++;
      }
    }
  
    return (
      <group position={[0, 0, heightFromGround]}>
        {/* Outer Wireframe Cuboid */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={frameDimensions} />
          <meshBasicMaterial wireframe color="black" />
        </mesh>
  
        {/* Render panels inside the cuboid */}
        {panels}
  
        {/* Glass-like Surface just above the outer cuboid on Z-axis */}
        <GlassSurface length={length} breadth={breadth} height={1} />
      </group>
    );
  };

  return (
    <div className="min-h-screen min-w-screen max-h-screen max-w-screen flex justify-center items-center">
      <div className="w-1/6 h-screen min-h-screen overflow-y-scroll bg-zinc-800 border-r border-r-gray-300">
        <div className="space-y-4 p-6  rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-gray-300 font-bold">Digital Twin - Solar Panel</h1>


        {/* Frame Length Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Frame Length</label>
          <input
            type="number"
            value={frameLength}
            onChange={(e) => setFrameLength(Number(e.target.value))}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Frame Breadth Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Frame Breadth</label>
          <input
            type="number"
            value={frameBreadth}
            onChange={(e) => setFrameBreadth(Number(e.target.value))}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Frame Height Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Frame Height</label>
          <input
            type="number"
            value={frameHeight}
            onChange={(e) => setFrameHeight(Number(e.target.value))}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Panel Length Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Panel Length</label>
          <input
            type="number"
            value={panelLength}
            onChange={(e) => setPanelLength(Number(e.target.value))}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Panel Breadth Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Panel Breadth</label>
          <input
            type="number"
            value={panelBreadth}
            onChange={(e) => setPanelBreadth(Number(e.target.value))}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Panel Height Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Panel Height</label>
          <input
            type="number"
            value={panelHeight}
            onChange={(e) => setPanelHeight(Number(e.target.value))}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Height from Ground Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Height From Ground</label>
          <input
            type="number"
            value={heightFromGround}
            onChange={(e) => setHeightFromGround(Number(e.target.value))}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sun Intensity */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-100">Sun Intensity</label>
          <input
            type="number"
            value={sunIntensity}
            onChange={(e) => setSunIntensity(parseFloat(e.target.value))}
            step = {0.1}
            className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      </div>
      <div className="w-5/6 h-screen min-h-screen bg-indigo-950">
          <Canvas camera={{ position: [0, 0, 100] }}>
              <ambientLight intensity={0.2} />
              <Sun radius={100} time={10} intensity={sunIntensity} />
              <SolarFrame frameDimensions={[frameLength, frameBreadth, frameHeight]} panelDimensions={[panelLength, panelBreadth, panelHeight]} panelCount={solarFrameData.panels.length} />
              <OrbitControls
                enableZoom={true}     // Enable zoom using the scroll
                zoomSpeed={1.0}       // Control zoom speed
                maxDistance={100}     // Max zoom out distance
                minDistance={2}       // Min zoom in distance
                enablePan={false}     // Disable panning (optional)
                target={[0, 0, 0]}    // The point the camera orbits around
              />
          </Canvas>
      </div>
    </div>
  )
}

export default App
