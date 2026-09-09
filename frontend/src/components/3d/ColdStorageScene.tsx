import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTwin } from '../../context/TwinContext';
import { Batch } from '../../types';

// Individual Tomato Crate with dynamic quality color & selection
const TomatoCrate: React.FC<{
  batch: Batch;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ batch, isSelected, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  // Quality color mapping
  const color = batch.qualityScore >= 75
    ? '#15803d' // Forest green: safe
    : batch.qualityScore >= 45
    ? '#d97706' // Warning amber
    : '#dc2626'; // Emergency red

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
      {/* Selection / Hover bounding frame */}
      {(isSelected || hovered) && (
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[1.12, 0.48, 0.82]} />
          <meshBasicMaterial
            color={isSelected ? '#38bdf8' : '#cbd5e1'}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Main Crate Box */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[1.0, 0.4, 0.7]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Crate Lip / Rim */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[1.04, 0.05, 0.74]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Tomato contents (Simulated red fruit spheres inside) */}
      <group position={[0, 0.32, 0]}>
        {[-0.32, 0, 0.32].map((x, i) =>
          [-0.18, 0.18].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0, z]}>
              <sphereGeometry args={[0.11, 8, 8]} />
              <meshStandardMaterial
                color={batch.qualityScore < 45 ? '#7f1d1d' : '#e11d48'}
                roughness={0.3}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Batch ID Procedural Canvas Plate */}
      <mesh position={[0, 0.22, 0.36]}>
        <planeGeometry args={[0.55, 0.22]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0.22, 0.365]}>
        <planeGeometry args={[0.5, 0.18]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

// Wall-mounted Cooling Unit with Spinning Fan
const CoolingUnit: React.FC<{ coolingOn: boolean; health: string }> = ({ coolingOn, health }) => {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (coolingOn && health !== 'failed' && fanRef.current) {
      fanRef.current.rotation.z -= delta * 12;
    }
  });

  const housingColor = health === 'failed' ? '#ef4444' : '#64748b';

  return (
    <group position={[-2.85, 2.1, 0]}>
      {/* Evaporator Unit Housing */}
      <mesh castShadow position={[0.2, 0, 0]}>
        <boxGeometry args={[0.35, 0.75, 1.4]} />
        <meshStandardMaterial color={housingColor} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Louver Grill */}
      <mesh position={[0.39, 0, 0]}>
        <boxGeometry args={[0.02, 0.65, 1.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Fan Blades */}
      <group ref={fanRef} position={[0.41, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]} position={[0, 0.16, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.015]} />
            <meshStandardMaterial color={coolingOn ? '#38bdf8' : '#94a3b8'} />
          </mesh>
        ))}
      </group>

      {/* Status LED */}
      <mesh position={[0.39, 0.28, 0.55]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={health === 'failed' ? '#ef4444' : coolingOn ? '#22c55e' : '#f59e0b'} />
      </mesh>
    </group>
  );
};

// Insulated Access Door that smoothly hinges open
const InsulatedDoor: React.FC<{ doorOpen: boolean }> = ({ doorOpen }) => {
  const doorHingeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (doorHingeRef.current) {
      const targetAngle = doorOpen ? Math.PI * 0.45 : 0;
      doorHingeRef.current.rotation.y = THREE.MathUtils.lerp(
        doorHingeRef.current.rotation.y,
        targetAngle,
        0.08
      );
    }
  });

  return (
    <group position={[2.9, 0, 1.3]}>
      {/* Door Frame on Right Wall */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.15, 2.8, 1.4]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Rotating Door Panel from Hinge */}
      <group ref={doorHingeRef} position={[0, 0, 0.65]}>
        <mesh position={[0, 1.4, -0.6]} castShadow>
          <boxGeometry args={[0.12, 2.65, 1.2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.5} />
        </mesh>

        {/* Industrial Door Handle */}
        <mesh position={[-0.1, 1.4, -1.05]}>
          <boxGeometry args={[0.06, 0.4, 0.06]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

// Roof Solar Photovoltaic Array
const SolarArray: React.FC<{ solarPower: number }> = ({ solarPower }) => {
  const solarActive = solarPower > 100;
  return (
    <group position={[0, 3.25, 0]} rotation={[-0.15, 0, 0]}>
      {/* Solar Frame Rack */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.2, 0.08, 2.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Monocrystalline Solar Cell Grid */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[5.0, 0.02, 2.4]} />
        <meshStandardMaterial
          color={solarActive ? '#1e3a8a' : '#0f172a'}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
};

// Lithium-Ion Battery Storage Cabinet with LED charge level
const BatteryCabinet: React.FC<{ batteryPercent: number }> = ({ batteryPercent }) => {
  const chargeLeds = [20, 40, 60, 80, 100];

  return (
    <group position={[-2.8, 0.7, 1.4]}>
      {/* Cabinet Box */}
      <mesh castShadow position={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 1.4, 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Battery Title & LEDs */}
      <group position={[0.41, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        {chargeLeds.map((threshold, idx) => {
          const isLit = batteryPercent >= threshold;
          const ledColor = threshold <= 20 ? '#ef4444' : threshold <= 40 ? '#f59e0b' : '#22c55e';
          return (
            <mesh key={idx} position={[-0.18 + idx * 0.09, 0.45, 0]}>
              <boxGeometry args={[0.06, 0.03, 0.01]} />
              <meshBasicMaterial color={isLit ? ledColor : '#334155'} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

// Emergency Flashing Strobe Beacon
const AlarmBeacon: React.FC<{ active: boolean }> = ({ active }) => {
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      if (active) {
        const pulse = (Math.sin(clock.getElapsedTime() * 10) + 1) / 2;
        (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + pulse * 0.7;
      } else {
        (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2;
      }
    }
  });

  return (
    <group position={[0, 3.0, 1.8]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh ref={beaconRef} position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={active ? 0.9 : 0.2} />
      </mesh>
    </group>
  );
};

// Shelving racks (Left & Right aisle)
const StorageShelves: React.FC = () => {
  return (
    <group>
      {/* Left Shelving Unit */}
      <group position={[-1.8, 0, -0.9]}>
        {/* Upright Posts */}
        {[-0.6, 0.6].map((x, i) =>
          [-0.4, 0.4].map((z, j) => (
            <mesh key={`l-${i}-${j}`} position={[x, 1.2, z]}>
              <boxGeometry args={[0.06, 2.4, 0.06]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}
        {/* Shelf Decks */}
        {[0.2, 1.1, 2.0].map((y, k) => (
          <mesh key={`lshelf-${k}`} position={[0, y, 0]}>
            <boxGeometry args={[1.3, 0.04, 0.88]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Middle Shelving Unit */}
      <group position={[0, 0, -0.9]}>
        {[-0.6, 0.6].map((x, i) =>
          [-0.4, 0.4].map((z, j) => (
            <mesh key={`m-${i}-${j}`} position={[x, 1.2, z]}>
              <boxGeometry args={[0.06, 2.4, 0.06]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}
        {[0.2, 1.1, 2.0].map((y, k) => (
          <mesh key={`mshelf-${k}`} position={[0, y, 0]}>
            <boxGeometry args={[1.3, 0.04, 0.88]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Right Shelving Unit */}
      <group position={[1.8, 0, -0.9]}>
        {[-0.6, 0.6].map((x, i) =>
          [-0.4, 0.4].map((z, j) => (
            <mesh key={`r-${i}-${j}`} position={[x, 1.2, z]}>
              <boxGeometry args={[0.06, 2.4, 0.06]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
            </mesh>
          ))
        )}
        {[0.2, 1.1, 2.0].map((y, k) => (
          <mesh key={`rshelf-${k}`} position={[0, y, 0]}>
            <boxGeometry args={[1.3, 0.04, 0.88]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// The Main Cold Storage Room Enclosure (Open Cutaway for judges)
const RoomEnclosure: React.FC<{ temperature: number }> = ({ temperature }) => {
  // Atmospheric floor tint shifting with temperature
  const floorTint = temperature > 12 ? '#451a1a' : temperature > 8.5 ? '#3b2f15' : '#1e293b';

  return (
    <group>
      {/* Insulated Concrete Floor */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <boxGeometry args={[6.2, 0.1, 4.2]} />
        <meshStandardMaterial color={floorTint} roughness={0.8} />
      </mesh>

      {/* Back Wall */}
      <mesh receiveShadow position={[0, 1.5, -2.05]}>
        <boxGeometry args={[6.2, 3.0, 0.1]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Left Wall */}
      <mesh receiveShadow position={[-3.05, 1.5, 0]}>
        <boxGeometry args={[0.1, 3.0, 4.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* Right Wall with doorway cutout */}
      <mesh receiveShadow position={[3.05, 1.5, -1.0]}>
        <boxGeometry args={[0.1, 3.0, 2.2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </mesh>

      {/* Ceiling / Roof Support Beams */}
      <mesh position={[0, 3.0, 0]}>
        <boxGeometry args={[6.2, 0.1, 4.2]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

// Exported Interactive 3D Component
export const ColdStorageScene: React.FC<{
  enableControls?: boolean;
  onSelectBatch?: (id: string) => void;
}> = ({ enableControls = true, onSelectBatch }) => {
  const { state, selectedBatchId, setSelectedBatchId } = useTwin();

  const handleSelect = (id: string) => {
    setSelectedBatchId(id);
    if (onSelectBatch) onSelectBatch(id);
  };

  // Environmental lighting color shift
  const ambientColor = state.temperature > 12.0
    ? '#fecaca' // warm reddish thermal breach
    : state.temperature > 8.5
    ? '#fef3c7' // amber warning
    : '#e0f2fe'; // crisp cold refrigeration cyan

  const isAlarm = state.overallRisk === 'critical' || state.temperature > 12.0;

  return (
    <div className="viewport-3d">
      {/* 3D Heads-Up Status Overlay */}
      <div className="viewport-overlay">
        <div className="viewport-badge">
          3D COLD TWIN: <strong style={{ color: '#38bdf8' }}>ONLINE</strong>
        </div>
        <div className="viewport-badge">
          CORE CHAMBER TEMP: <strong style={{ color: state.temperature > 12 ? '#ef4444' : '#22c55e' }}>{state.temperature}°C</strong>
        </div>
        <div className="viewport-badge">
          CHILLER: <strong style={{ color: state.coolingOn ? '#22c55e' : '#ef4444' }}>{state.coolingOn ? 'ACTIVE' : 'OFFLINE'}</strong>
        </div>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 4.2, 6.2], fov: 42 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          {/* Dynamic environmental lighting */}
          <ambientLight intensity={0.85} color={ambientColor} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight
            position={[0, 2.6, 0]}
            intensity={isAlarm ? 1.8 : 0.6}
            color={isAlarm ? '#ef4444' : '#bae6fd'}
            distance={8}
          />

          {/* Cold Storage Architecture */}
          <RoomEnclosure temperature={state.temperature} />
          <StorageShelves />
          <CoolingUnit coolingOn={state.coolingOn} health={state.refrigeratorHealth} />
          <InsulatedDoor doorOpen={state.doorOpen} />
          <SolarArray solarPower={state.solarPower} />
          <BatteryCabinet batteryPercent={state.batteryPercent} />
          <AlarmBeacon active={isAlarm} />

          {/* 6 Batches of Tomato Crates */}
          {state.batches.map((batch) => (
            <TomatoCrate
              key={batch.id}
              batch={batch}
              isSelected={selectedBatchId === batch.id}
              onSelect={handleSelect}
            />
          ))}

          {/* Orbit Camera Controls */}
          {enableControls && (
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minDistance={3.5}
              maxDistance={12}
              maxPolarAngle={Math.PI / 2 - 0.05}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
