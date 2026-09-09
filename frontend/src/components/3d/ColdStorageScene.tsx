import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTwin } from '../../context/TwinContext';
import { Batch } from '../../types';

// Helper to generate an authentic crisp printed batch lot plate in WebGL
const useLotTexture = (id: string, score: number) => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 256, 96);
      ctx.fillStyle = score >= 75 ? '#15803d' : score >= 45 ? '#b45309' : '#b91c1c';
      ctx.fillRect(0, 0, 16, 96);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(id, 28, 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${score}%`, 242, 48);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }, [id, score]);
};

// Individual Tomato Crate with structural slats & lot plate
const TomatoCrate: React.FC<{
  batch: Batch;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ batch, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const lotTexture = useLotTexture(batch.id, Math.round(batch.qualityScore));

  const bodyColor = batch.qualityScore >= 75
    ? '#166534' // Agricultural dark green
    : batch.qualityScore >= 45
    ? '#b45309' // Warning amber
    : '#991b1b'; // Emergency crimson

  return (
    <group
      position={batch.cratePosition}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(batch.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* High-visibility selection wireframe bracket */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.08, 0.46, 0.78]} />
          <meshBasicMaterial
            color={isSelected ? '#0284c7' : '#94a3b8'}
            wireframe
            wireframeLinewidth={2}
          />
        </mesh>
      )}

      {/* Main Crate Polymer Basin */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[1.0, 0.38, 0.7]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Reinforced Structural Corner Posts */}
      {[-0.48, 0.48].map((x, i) =>
        [-0.33, 0.33].map((z, j) => (
          <mesh key={`post-${i}-${j}`} position={[x, 0.21, z]}>
            <boxGeometry args={[0.06, 0.42, 0.06]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
        ))
      )}

      {/* Stack Lip Frame */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.02, 0.04, 0.72]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Tomato Contents inside Crate */}
      <group position={[0, 0.3, 0]}>
        {[-0.3, 0, 0.3].map((x, i) =>
          [-0.16, 0.16].map((z, j) => (
            <mesh key={`tom-${i}-${j}`} position={[x, 0, z]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color={batch.qualityScore < 45 ? '#7f1d1d' : '#dc2626'}
                roughness={0.25}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Printed Batch ID Plate on Crate Face */}
      <mesh position={[0, 0.2, 0.355]}>
        <planeGeometry args={[0.62, 0.22]} />
        <meshBasicMaterial map={lotTexture} />
      </mesh>
    </group>
  );
};

// Evaporator Refrigeration Loop with Aerodynamic Fan
const CoolingUnit: React.FC<{ coolingOn: boolean; health: string }> = ({ coolingOn, health }) => {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (coolingOn && health !== 'failed' && fanRef.current) {
      fanRef.current.rotation.z -= delta * 14;
    }
  });

  const housingColor = health === 'failed' ? '#991b1b' : '#334155';

  return (
    <group position={[-2.85, 2.1, 0]}>
      {/* Heavy Sheetmetal Housing */}
      <mesh castShadow position={[0.2, 0, 0]}>
        <boxGeometry args={[0.35, 0.75, 1.4]} />
        <meshStandardMaterial color={housingColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Intake Louver Grille */}
      <mesh position={[0.38, 0, 0]}>
        <boxGeometry args={[0.02, 0.65, 1.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Rotating Fan Assembly */}
      <group ref={fanRef} position={[0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0.16, 0]}>
            <boxGeometry args={[0.06, 0.22, 0.015]} />
            <meshStandardMaterial color={coolingOn ? '#38bdf8' : '#64748b'} />
          </mesh>
        ))}
      </group>

      {/* Instrument Status Beacon */}
      <mesh position={[0.38, 0.28, 0.55]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={health === 'failed' ? '#ef4444' : coolingOn ? '#22c55e' : '#f59e0b'} />
      </mesh>
    </group>
  );
};

// Insulated Vault Seal Door
const InsulatedDoor: React.FC<{ doorOpen: boolean }> = ({ doorOpen }) => {
  const doorHingeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (doorHingeRef.current) {
      const targetAngle = doorOpen ? Math.PI * 0.42 : 0;
      doorHingeRef.current.rotation.y = THREE.MathUtils.lerp(
        doorHingeRef.current.rotation.y,
        targetAngle,
        0.08
      );
    }
  });

  return (
    <group position={[2.9, 0, 1.3]}>
      {/* Structural Jamb */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.15, 2.8, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Rotating Insulated Leaf Panel */}
      <group ref={doorHingeRef} position={[0, 0, 0.65]}>
        <mesh position={[0, 1.4, -0.6]} castShadow>
          <boxGeometry args={[0.12, 2.65, 1.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.4} />
        </mesh>

        {/* Compression Lock Bar Handle */}
        <mesh position={[-0.1, 1.4, -1.05]}>
          <boxGeometry args={[0.05, 0.5, 0.05]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// Photovoltaic Solar Array
const SolarArray: React.FC<{ solarPower: number }> = ({ solarPower }) => {
  const isGenerating = solarPower > 80;
  return (
    <group position={[0, 3.25, 0]} rotation={[-0.12, 0, 0]}>
      {/* Sub-rack Aluminum Girders */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.2, 0.08, 2.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Silicon Solar Cells */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[5.0, 0.02, 2.4]} />
        <meshStandardMaterial
          color={isGenerating ? '#172554' : '#090d16'}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
};

// Lithium-Ion Energy Cabinet
const BatteryCabinet: React.FC<{ batteryPercent: number }> = ({ batteryPercent }) => {
  const steps = [20, 40, 60, 80, 100];
  return (
    <group position={[-2.8, 0.7, 1.4]}>
      {/* NEMA Enclosure */}
      <mesh castShadow position={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 1.4, 0.7]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Charge Status LED Ladder */}
      <group position={[0.41, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {steps.map((level, idx) => {
          const isLit = batteryPercent >= level;
          const ledColor = level <= 20 ? '#ef4444' : level <= 40 ? '#f59e0b' : '#22c55e';
          return (
            <mesh key={idx} position={[-0.16 + idx * 0.08, 0.45, 0]}>
              <boxGeometry args={[0.05, 0.025, 0.01]} />
              <meshBasicMaterial color={isLit ? ledColor : '#1e293b'} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// Strobe Alarm Beacon
const AlarmBeacon: React.FC<{ active: boolean }> = ({ active }) => {
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      if (active) {
        const pulse = (Math.sin(clock.getElapsedTime() * 12) + 1) / 2;
        (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + pulse * 0.8;
      } else {
        (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15;
      }
    }
  });

  return (
    <group position={[0, 3.0, 1.8]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh ref={beaconRef} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={active ? 0.9 : 0.15} />
      </mesh>
    </group>
  );
};

// Structural Shelving Racks
const StorageShelves: React.FC = () => {
  return (
    <group>
      {[-1.8, 0, 1.8].map((posX, sIdx) => (
        <group key={`shelf-${sIdx}`} position={[posX, 0, -0.9]}>
          {/* Vertical Steel Posts */}
          {[-0.6, 0.6].map((x, i) =>
            [-0.4, 0.4].map((z, j) => (
              <mesh key={`post-${i}-${j}`} position={[x, 1.2, z]}>
                <boxGeometry args={[0.05, 2.4, 0.05]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
              </mesh>
            ))
          )}
          {/* Horizontal Channel Decks */}
          {[0.2, 1.1, 2.0].map((y, k) => (
            <mesh key={`deck-${k}`} position={[0, y, 0]}>
              <boxGeometry args={[1.3, 0.03, 0.86]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Cold Vault Cutaway Chamber Structure with Floor Grid
const RoomEnclosure: React.FC<{ temperature: number }> = ({ temperature }) => {
  const floorColor = temperature > 12 ? '#241414' : temperature > 8.5 ? '#1f1b13' : '#0f172a';

  return (
    <group>
      {/* Floor Slab */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[6.2, 0.1, 4.2]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>

      {/* Coordinate Grid on Floor */}
      <gridHelper args={[6.0, 12, '#334155', '#1e293b']} position={[0, 0.01, 0]} />

      {/* Rear Insulated Wall */}
      <mesh receiveShadow position={[0, 1.5, -2.05]}>
        <boxGeometry args={[6.2, 3.0, 0.1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
      </mesh>

      {/* Left Wall */}
      <mesh receiveShadow position={[-3.05, 1.5, 0]}>
        <boxGeometry args={[0.1, 3.0, 4.2]} />
        <meshStandardMaterial color="#b4bcc8" roughness={0.9} />
      </mesh>

      {/* Right Wall with Doorway */}
      <mesh receiveShadow position={[3.05, 1.5, -1.0]}>
        <boxGeometry args={[0.1, 3.0, 2.2]} />
        <meshStandardMaterial color="#b4bcc8" roughness={0.9} />
      </mesh>

      {/* Roof Steel Framing */}
      <mesh position={[0, 3.0, 0]}>
        <boxGeometry args={[6.2, 0.08, 4.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} />
      </mesh>
    </group>
  );
};

export const ColdStorageScene: React.FC<{
  enableControls?: boolean;
  onSelectBatch?: (id: string) => void;
}> = ({ enableControls = true, onSelectBatch }) => {
  const { state, selectedBatchId, setSelectedBatchId } = useTwin();
  const controlsRef = useRef<any>(null);

  const handleSelect = (id: string) => {
    setSelectedBatchId(id);
    if (onSelectBatch) onSelectBatch(id);
  };

  const isAlarm = state.overallRisk === 'critical' || state.temperature > 12.0;

  // Engineering Camera Presets
  const setCameraView = (view: 'isometric' | 'front' | 'shelf' | 'chiller') => {
    if (!controlsRef.current) return;
    if (view === 'isometric') {
      controlsRef.current.object.position.set(0, 4.2, 6.2);
      controlsRef.current.target.set(0, 1.2, 0);
    } else if (view === 'front') {
      controlsRef.current.object.position.set(0, 1.6, 5.8);
      controlsRef.current.target.set(0, 1.2, 0);
    } else if (view === 'shelf') {
      controlsRef.current.object.position.set(1.4, 2.0, 2.6);
      controlsRef.current.target.set(0.8, 1.0, -0.8);
    } else if (view === 'chiller') {
      controlsRef.current.object.position.set(-1.6, 2.5, 2.2);
      controlsRef.current.target.set(-2.5, 2.0, 0);
    }
    controlsRef.current.update();
  };

  return (
    <div className="viewport-3d">
      {/* Telemetry HUD */}
      <div className="viewport-overlay">
        <div className="viewport-badge">
          MODEL: <strong>DIGITAL TWIN [SPATIAL_V2]</strong>
        </div>
        <div className="viewport-badge">
          CHAMBER SENSOR: <strong style={{ color: state.temperature > 12 ? '#ef4444' : '#22c55e' }}>{state.temperature}°C</strong>
        </div>
        <div className="viewport-badge">
          EVAP FAN: <strong style={{ color: state.coolingOn ? '#22c55e' : '#ef4444' }}>{state.coolingOn ? `${state.fanRpm} RPM` : 'STANDSTILL'}</strong>
        </div>
      </div>

      {/* Engineering Viewpoint Selector */}
      <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 10, display: 'flex', gap: 4 }}>
        <button className="btn btn-sm" onClick={() => setCameraView('isometric')}>Isometric</button>
        <button className="btn btn-sm" onClick={() => setCameraView('front')}>Elevation</button>
        <button className="btn btn-sm" onClick={() => setCameraView('shelf')}>Shelves</button>
        <button className="btn btn-sm" onClick={() => setCameraView('chiller')}>Evaporator</button>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 4.2, 6.2], fov: 42 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[6, 9, 6]} intensity={1.2} castShadow />
          <pointLight
            position={[0, 2.5, 0]}
            intensity={isAlarm ? 1.8 : 0.4}
            color={isAlarm ? '#ef4444' : '#93c5fd'}
            distance={8}
          />

          <RoomEnclosure temperature={state.temperature} />
          <StorageShelves />
          <CoolingUnit coolingOn={state.coolingOn} health={state.refrigeratorHealth} />
          <InsulatedDoor doorOpen={state.doorOpen} />
          <SolarArray solarPower={state.solarPower} />
          <BatteryCabinet batteryPercent={state.batteryPercent} />
          <AlarmBeacon active={isAlarm} />

          {state.batches.map((batch) => (
            <TomatoCrate
              key={batch.id}
              batch={batch}
              isSelected={selectedBatchId === batch.id}
              onSelect={handleSelect}
            />
          ))}

          {enableControls && (
            <OrbitControls
              ref={controlsRef}
              enableDamping
              dampingFactor={0.05}
              minDistance={3.0}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2 - 0.05}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
