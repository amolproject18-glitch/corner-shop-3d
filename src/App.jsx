import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Eye, EyeOff, RotateCcw, Store } from 'lucide-react';

const palette = {
  wall: '#f1e9d9',
  wallShade: '#e5d9c4',
  floor: '#c79a68',
  wood: '#80553a',
  woodLight: '#bd8b5b',
  metal: '#485663',
  ink: '#23313b',
  teal: '#227a78',
  saffron: '#e99a37',
  red: '#c9523d',
  green: '#6e9362',
};

function Box({
  position,
  size,
  color,
  rotation,
  radius = 0,
  roughness = 0.82,
  metalness = 0,
}) {
  const material = (
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  );
  if (radius > 0) {
    return (
      <RoundedBox
        args={size}
        radius={radius}
        smoothness={3}
        position={position}
        rotation={rotation}
        castShadow
        receiveShadow
      >
        {material}
      </RoundedBox>
    );
  }
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      {material}
    </mesh>
  );
}

function Cylinder({ position, radius, height, color, rotation }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 20]} />
      <meshStandardMaterial color={color} roughness={0.75} />
    </mesh>
  );
}

function GlassPanel({ position, size }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color="#a5c7c2"
        roughness={0.22}
        metalness={0.08}
        transmission={0.42}
        thickness={0.08}
        transparent
        opacity={0.58}
        depthWrite={false}
      />
    </mesh>
  );
}

function Ball({ position, scale, color, roughness = 0.78 }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 20, 16]} />
      <meshStandardMaterial color={color} roughness={roughness} />
    </mesh>
  );
}

function Segment({ start, end, radius, color }) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(to, from);
  const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const rotation = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize(),
  );
  return (
    <mesh position={midpoint} quaternion={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[radius * 0.82, radius, direction.length(), 14]} />
      <meshStandardMaterial color={color} roughness={0.86} />
    </mesh>
  );
}

function Label({ children, position, color = '#23313b' }) {
  return (
    <Html position={position} center distanceFactor={10} zIndexRange={[10, 0]}>
      <div className="scene-label" style={{ color }}>
        {children}
      </div>
    </Html>
  );
}

function OperatorCharacter() {
  const skin = '#bd8062';
  const shirt = '#397f83';
  const trousers = '#34445b';
  return (
    <>
      <group position={[-1.65, 0, -0.65]}>
        {/* Office chair */}
      <Box position={[0, 1.04, -0.34]} size={[0.66, 0.74, 0.16]} color="#364d60" radius={0.07} />
      <Box position={[0, 0.78, -0.04]} size={[0.7, 0.14, 0.62]} color="#435c70" radius={0.06} />
      <Cylinder position={[0, 0.42, -0.04]} radius={0.07} height={0.62} color={palette.metal} />
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0.12, 0]}>
          <Cylinder position={[side * 0.33, 0, 0]} radius={0.035} height={0.66} color={palette.metal} rotation={[0, 0, Math.PI / 2]} />
          <Cylinder position={[side * 0.33, 0, 0]} radius={0.045} height={0.12} color="#25313a" rotation={[Math.PI / 2, 0, 0]} />
        </group>
      ))}
      </group>

      <group name="online-service-center-operator" position={[-1.65, 0, -0.65]}>
        <Box position={[0, 1.54, 0.03]} size={[0.63, 0.78, 0.38]} color={shirt} radius={0.1} />
        <Cylinder position={[0, 1.98, 0.03]} radius={0.12} height={0.18} color={skin} />
        <Ball position={[0, 2.25, 0.08]} scale={[0.25, 0.31, 0.25]} color={skin} />
        <Ball position={[0, 2.47, 0.04]} scale={[0.25, 0.13, 0.25]} color="#282321" />
        <Ball position={[-0.235, 2.27, 0.1]} scale={[0.055, 0.085, 0.06]} color={skin} />
        <Ball position={[0.235, 2.27, 0.1]} scale={[0.055, 0.085, 0.06]} color={skin} />
        <Ball position={[-0.088, 2.28, 0.304]} scale={[0.024, 0.028, 0.018]} color="#262522" />
        <Ball position={[0.088, 2.28, 0.304]} scale={[0.024, 0.028, 0.018]} color="#262522" />
        <Box position={[0, 2.15, 0.319]} size={[0.095, 0.035, 0.04]} color="#694436" radius={0.015} />

        {/* Bent legs fit under the desk */}
        <Segment start={[-0.17, 1.24, 0.03]} end={[-0.2, 0.79, 0.49]} radius={0.13} color={trousers} />
        <Segment start={[0.17, 1.24, 0.03]} end={[0.2, 0.79, 0.49]} radius={0.13} color={trousers} />
        <Segment start={[-0.2, 0.79, 0.49]} end={[-0.2, 0.29, 0.23]} radius={0.12} color={trousers} />
        <Segment start={[0.2, 0.79, 0.49]} end={[0.2, 0.29, 0.23]} radius={0.12} color={trousers} />
        <Box position={[-0.2, 0.19, 0.26]} size={[0.2, 0.12, 0.32]} color="#393b3a" radius={0.04} />
        <Box position={[0.2, 0.19, 0.26]} size={[0.2, 0.12, 0.32]} color="#393b3a" radius={0.04} />

        {/* Hands reach forward to the keyboard */}
        <Segment start={[-0.28, 1.8, 0.09]} end={[-0.34, 1.44, 0.56]} radius={0.09} color={shirt} />
        <Segment start={[0.28, 1.8, 0.09]} end={[0.34, 1.44, 0.56]} radius={0.09} color={shirt} />
        <Segment start={[-0.34, 1.44, 0.56]} end={[-0.29, 1.14, 0.91]} radius={0.07} color={skin} />
        <Segment start={[0.34, 1.44, 0.56]} end={[0.29, 1.14, 0.91]} radius={0.07} color={skin} />
        <Ball position={[-0.29, 1.12, 0.92]} scale={[0.09, 0.055, 0.09]} color={skin} />
        <Ball position={[0.29, 1.12, 0.92]} scale={[0.09, 0.055, 0.09]} color={skin} />
      </group>
    </>
  );
}

function ShopkeeperCharacter() {
  const skin = '#a96d50';
  const shirt = '#e6ad48';
  return (
    <group name="general-store-shopkeeper" position={[1.55, 0, 0.04]}>
        <Box position={[0, 1.53, 0]} size={[0.63, 0.9, 0.38]} color={shirt} radius={0.1} />
        <Box position={[0, 1.6, 0.201]} size={[0.12, 0.32, 0.025]} color="#f4e4c4" radius={0.018} />
        <Cylinder position={[0, 2.04, 0]} radius={0.12} height={0.17} color={skin} />
        <Ball position={[0, 2.31, 0.02]} scale={[0.25, 0.3, 0.25]} color={skin} />
        <Ball position={[0, 2.53, -0.025]} scale={[0.255, 0.13, 0.255]} color="#29251f" />
        <Ball position={[-0.238, 2.33, 0.03]} scale={[0.055, 0.085, 0.06]} color={skin} />
        <Ball position={[0.238, 2.33, 0.03]} scale={[0.055, 0.085, 0.06]} color={skin} />
        <Ball position={[-0.088, 2.34, 0.247]} scale={[0.024, 0.03, 0.018]} color="#29231f" />
        <Ball position={[0.088, 2.34, 0.247]} scale={[0.024, 0.03, 0.018]} color="#29231f" />
        <Box position={[0, 2.21, 0.272]} size={[0.09, 0.035, 0.04]} color="#6d4232" radius={0.015} />
        <Segment start={[-0.18, 1.1, 0]} end={[-0.19, 0.15, 0.02]} radius={0.13} color="#425064" />
        <Segment start={[0.18, 1.1, 0]} end={[0.19, 0.15, 0.02]} radius={0.13} color="#425064" />
        <Box position={[-0.19, 0.09, 0.07]} size={[0.22, 0.14, 0.34]} color="#373b3d" radius={0.035} />
        <Box position={[0.19, 0.09, 0.07]} size={[0.22, 0.14, 0.34]} color="#373b3d" radius={0.035} />
        {/* Hands rest at the customer-facing edge of the billing counter */}
        <Segment start={[-0.28, 1.79, 0.05]} end={[-0.34, 1.43, 0.39]} radius={0.09} color={shirt} />
        <Segment start={[0.28, 1.79, 0.05]} end={[0.34, 1.43, 0.39]} radius={0.09} color={shirt} />
        <Segment start={[-0.34, 1.43, 0.39]} end={[-0.48, 1.36, 1.37]} radius={0.07} color={skin} />
        <Segment start={[0.34, 1.43, 0.39]} end={[0.48, 1.36, 1.37]} radius={0.07} color={skin} />
        <Ball position={[-0.48, 1.34, 1.39]} scale={[0.09, 0.055, 0.09]} color={skin} />
        <Ball position={[0.48, 1.34, 1.39]} scale={[0.09, 0.055, 0.09]} color={skin} />
    </group>
  );
}

function Monitor({ position }) {
  return (
    <group position={position}>
      <Box position={[0, 0.27, 0]} size={[0.75, 0.5, 0.09]} color="#303a40" radius={0.035} />
      <Box position={[0, 0.28, 0.051]} size={[0.65, 0.39, 0.012]} color="#75b8b1" radius={0.012} roughness={0.35} />
      <Box position={[0, 0.02, 0]} size={[0.1, 0.12, 0.1]} color="#303a40" />
      <Box position={[0, -0.045, 0.04]} size={[0.34, 0.045, 0.2]} color="#303a40" radius={0.02} />
      <Box position={[0, 0.3, 0.06]} size={[0.28, 0.035, 0.008]} color="#d1eee0" radius={0.008} />
    </group>
  );
}

function ServiceArea() {
  const paperColors = ['#f4ede0', '#d7e4df', '#eacb9e', '#d4dbee'];
  return (
    <group position={[0, 0, -7.1]}>
      <Label position={[-1.72, 3.32, -0.02]} color="#237b7b">ONLINE SERVICE CENTER · LOCKED REAR OFFICE</Label>
      {/* Computer work desk */}
      <Box position={[-1.68, 1.06, 0.28]} size={[2.24, 0.13, 1.35]} color={palette.woodLight} radius={0.06} />
      <Box position={[-1.68, 0.55, -0.22]} size={[2.08, 0.92, 0.16]} color={palette.wood} radius={0.025} />
      <Box position={[-2.62, 0.49, 0.78]} size={[0.13, 0.94, 0.14]} color={palette.wood} />
      <Box position={[-0.74, 0.49, 0.78]} size={[0.13, 0.94, 0.14]} color={palette.wood} />
      <Box position={[-1.68, 0.08, 0.29]} size={[2.1, 0.09, 1.13]} color="#b98250" />
      <Monitor position={[-1.68, 1.15, 0.04]} />
      <Box position={[-1.7, 1.14, 0.4]} size={[0.74, 0.055, 0.27]} color="#29343d" radius={0.025} />
      {Array.from({ length: 10 }, (_, index) => (
        <Box
          key={index}
          position={[-2.01 + index * 0.069, 1.173, 0.39]}
          size={[0.04, 0.008, 0.16]}
          color="#bac9c9"
          radius={0.004}
        />
      ))}
      <Ball position={[-1.08, 1.14, 0.42]} scale={[0.09, 0.035, 0.12]} color="#333e47" />

      {/* Printer and photocopier */}
      <Box position={[-2.57, 1.43, -0.78]} size={[0.72, 0.58, 0.62]} color="#d8d8d1" radius={0.045} />
      <Box position={[-2.57, 1.72, -0.78]} size={[0.58, 0.035, 0.47]} color="#f3f0e8" radius={0.018} />
      <Box position={[-2.57, 1.23, -0.45]} size={[0.42, 0.08, 0.025]} color="#879493" radius={0.012} />
      <Box position={[-2.72, 1.45, -0.45]} size={[0.2, 0.12, 0.025]} color="#38474c" radius={0.012} />
      <Label position={[-2.57, 2.03, -0.78]}>PRINTER</Label>

      <Box position={[-2.53, 0.8, -1.63]} size={[0.86, 0.14, 0.76]} color={palette.woodLight} radius={0.035} />
      <Box position={[-2.53, 0.43, -1.63]} size={[0.76, 0.58, 0.65]} color="#d4d5d0" radius={0.04} />
      <Box position={[-2.53, 0.73, -1.63]} size={[0.66, 0.04, 0.53]} color="#f3f1e9" radius={0.018} />
      <Box position={[-2.53, 0.49, -1.29]} size={[0.42, 0.07, 0.02]} color="#859391" radius={0.01} />
      <Label position={[-2.53, 1.13, -1.63]}>PHOTOCOPIER</Label>

      {/* Public-service documents and forms on left wall */}
      {paperColors.map((color, index) => (
        <group key={color} position={[-3.04, 2.55 + (index % 2) * 0.62, -2.9 + index * 0.47]}>
          <Box position={[0, 0, 0]} size={[0.055, 0.42, 0.33]} color="#785b40" radius={0.012} />
          <Box position={[0.032, 0, 0]} size={[0.012, 0.34, 0.25]} color={color} />
          <Box position={[0.04, 0.075, 0]} size={[0.01, 0.025, 0.15]} color={palette.teal} />
        </group>
      ))}
      <OperatorCharacter />
    </group>
  );
}

function GroceryShelves() {
  const packageColors = ['#e9a03f', '#bd5140', '#4d8580', '#dec77a', '#75965e', '#eee1c6'];
  const columns = [-2.36, -1.62, -0.88, -0.14, 0.6, 1.34, 2.08];
  const levels = [0.78, 1.55, 2.32, 3.09, 3.86, 4.63];
  const rightShelfPositions = [
    -9.45, -8.42, -7.39,
    -6.36, -5.33, -4.3,
    -3.27, -2.24, -1.21,
    -0.18, 0.85, 1.88, 2.91,
  ];
  const shelfSections = [
    { title: 'HOME CARE', center: -8.42, colors: ['#75965e', '#eee1c6'] },
    { title: 'GRAINS & PANTRY', center: -5.33, colors: ['#dec77a', '#bd5140'] },
    { title: 'SNACKS', center: -2.24, colors: ['#e9a03f', '#bd5140', '#4d8580'] },
    { title: 'STATIONERY & DAILY NEEDS', center: 1.37, colors: ['#4d8580', '#e9a03f', '#d7dbee'] },
  ];
  return (
    <group>
      {/* Tall shelves line the rear and right walls without closing off the shop */}
      <Box position={[1.62, 2.61, -10.35]} size={[3.02, 5.16, 0.15]} color="#75543c" radius={0.025} />
      {levels.map((y) => (
        <Box key={`back-shelf-${y}`} position={[1.62, y, -10.15]} size={[3.02, 0.09, 0.58]} color="#b8824f" radius={0.02} />
      ))}
      {[-0.02, 0.72, 1.46, 2.2, 2.94].map((x) => (
        <Box key={`back-upright-${x}`} position={[x, 2.61, -10.11]} size={[0.055, 5.15, 0.57]} color="#896342" />
      ))}

      {/* Repeated packs read as grocery, stationery and household stock */}
      {levels.slice(0, 5).flatMap((y, row) =>
        columns.map((x, column) => {
          const color = packageColors[(row * 3 + column) % packageColors.length];
          const tall = (row + column) % 3 === 0;
          return (
            <group key={`goods-${row}-${column}`}>
              <Box
                position={[x, y + (tall ? 0.23 : 0.16), -9.88]}
                size={[tall ? 0.31 : 0.42, tall ? 0.42 : 0.29, 0.24]}
                color={color}
                radius={0.035}
              />
              <Box
                position={[x, y + (tall ? 0.23 : 0.16), -9.749]}
                size={[0.12, 0.035, 0.012]}
                color="#f6e9c9"
                radius={0.009}
              />
            </group>
          );
        }),
      )}

      {/* Right-side tall aisle shelving */}
      <Box position={[2.91, 2.58, -3.28]} size={[0.14, 5.12, 11.76]} color="#75543c" radius={0.025} />
      {levels.map((y) => (
        <Box key={`aisle-shelf-${y}`} position={[2.7, y, -3.28]} size={[0.55, 0.09, 11.68]} color="#b8824f" radius={0.02} />
      ))}
      {[-9.85, -7.42, -4.99, -2.56, -0.13, 2.3].map((z) => (
        <Box key={`aisle-upright-${z}`} position={[2.7, 2.58, z]} size={[0.55, 5.08, 0.055]} color="#896342" />
      ))}
      {levels.slice(0, 5).flatMap((y, row) =>
        rightShelfPositions.map((z, column) => {
          const sectionIndex = Math.min(Math.floor(column / 3), shelfSections.length - 1);
          const section = shelfSections[sectionIndex];
          const color = section.colors[(row + column) % section.colors.length];
          const productY = y + 0.18;
          return (
            <group key={`aisle-goods-${row}-${column}`}>
              <Box
                position={[2.43, productY, z]}
                size={[0.25, 0.34, 0.36]}
                color={color}
                radius={0.03}
              />
              <Box
                position={[2.298, productY, z]}
                size={[0.012, 0.12, 0.19]}
                color="#f6e9c9"
                radius={0.006}
              />
            </group>
          );
        }),
      )}

      {shelfSections.map((section) => (
        <Label key={section.title} position={[2.28, 5.08, section.center]} color="#6f4a2e">
          {section.title}
        </Label>
      ))}

      {/* Low, double-sided gondola keeps the center aisle organized and open. */}
      {[0.58, 1.12, 1.66].map((y) => (
        <group key={`gondola-tier-${y}`}>
          <Box position={[1.35, y, -2.65]} size={[0.82, 0.075, 4.46]} color="#a97443" radius={0.025} />
          <Box position={[0.93, y + 0.045, -2.65]} size={[0.025, 0.035, 4.35]} color="#e5d2ad" />
          <Box position={[1.77, y + 0.045, -2.65]} size={[0.025, 0.035, 4.35]} color="#e5d2ad" />
          {[-4.68, -3.88, -3.08, -2.28, -1.48, -0.68].flatMap((z, index) =>
            [1.06, 1.64].map((x, side) => (
              <group key={`gondola-item-${y}-${index}-${side}`}>
                <Box
                  position={[x, y + 0.23, z]}
                  size={[0.19, 0.28, 0.3]}
                  color={packageColors[(index + side * 2 + Math.round(y * 3)) % packageColors.length]}
                  radius={0.025}
                />
                <Box
                  position={[x + (side === 0 ? -0.099 : 0.099), y + 0.23, z]}
                  size={[0.012, 0.12, 0.16]}
                  color="#f6e9c9"
                  radius={0.005}
                />
              </group>
            )),
          )}
        </group>
      ))}
      <Box position={[1.35, 2.02, -0.35]} size={[0.86, 0.48, 0.09]} color="#765039" radius={0.035} />
      <Label position={[1.35, 2.05, -0.29]} color="#f4e8d0">AISLE 01 · PACKAGED GOODS</Label>

      {/* Countertop stationery rack is kept beside, not on top of, the register. */}
      <Box position={[0.95, 1.38, 2.16]} size={[0.82, 0.46, 0.1]} color="#724a32" radius={0.025} />
      {Array.from({ length: 8 }, (_, index) => (
        <Cylinder
          key={`pens-${index}`}
          position={[0.63 + index * 0.09, 1.72, 2.16]}
          radius={0.025}
          height={0.3 + (index % 3) * 0.06}
          color={packageColors[index % packageColors.length]}
        />
      ))}
    </group>
  );
}

function BillingCounter() {
  const counterProducts = [
    [0.77, '#d95040', 0.27],
    [1.04, '#e8af45', 0.32],
    [2.08, '#5e9470', 0.29],
    [2.35, '#d8c398', 0.24],
  ];
  return (
    <group position={[-2.1, 0, 0]}>
      <Label position={[1.6, 3.35, 1.05]} color="#c27722">GENERAL STORE</Label>
      {/* Billing counter */}
      <Box position={[1.57, 0.64, 1.73]} size={[2.48, 1.16, 0.84]} color={palette.wood} radius={0.055} />
      <Box position={[1.57, 1.25, 1.73]} size={[2.63, 0.13, 0.98]} color={palette.woodLight} radius={0.04} />
      <Box position={[1.57, 0.66, 2.16]} size={[2.15, 0.86, 0.035]} color="#a36d43" radius={0.025} />
      <Box position={[1.57, 0.68, 2.184]} size={[0.055, 0.57, 0.018]} color="#dec093" />
      <Box position={[1.57, 0.37, 2.184]} size={[1.96, 0.045, 0.018]} color="#dec093" />

      {/* Cash register, display, and scanner */}
      <Box position={[2.48, 1.49, 1.55]} size={[0.49, 0.38, 0.38]} color="#354b4c" radius={0.045} />
      <Box position={[2.48, 1.72, 1.55]} size={[0.42, 0.22, 0.065]} color="#293c40" radius={0.02} rotation={[-0.12, 0, 0]} />
      <Box position={[2.48, 1.73, 1.587]} size={[0.32, 0.12, 0.01]} color="#85b7a4" radius={0.008} />
      <Box position={[2.48, 1.39, 1.78]} size={[0.34, 0.035, 0.23]} color="#27383a" radius={0.012} />
      <Box position={[2.48, 1.42, 1.78]} size={[0.2, 0.015, 0.13]} color="#d0d4c7" radius={0.008} />

      {counterProducts.map(([x, color, height], index) => (
        <group key={`counter-product-${index}`}>
          <Box position={[x, 1.43 + height / 2, 1.83]} size={[0.19, height, 0.2]} color={color} radius={0.025} />
          <Box position={[x, 1.49 + height / 2, 1.934]} size={[0.1, 0.045, 0.01]} color="#f3e5c9" radius={0.006} />
        </group>
      ))}
      <Cylinder position={[1.4, 1.46, 1.92]} radius={0.11} height={0.3} color="#cf7d39" />
      <Cylinder position={[1.68, 1.46, 1.92]} radius={0.11} height={0.3} color="#62936a" />
      <ShopkeeperCharacter />
    </group>
  );
}

function ShopRoom({ showRoof, showFrontWall }) {
  const roomCenterZ = -2.98;
  const roomLength = 15;
  const roomFrontZ = 4.52;
  const roomBackZ = -10.48;
  const serviceRoomFrontZ = -6.05;

  return (
    <group>
      {/* One continuous, elongated floor; no interior partitions */}
      <Box position={[0, -0.12, roomCenterZ]} size={[6.35, 0.24, roomLength]} color={palette.floor} />
      <Box position={[0, 0.015, roomCenterZ]} size={[6.08, 0.035, roomLength - 0.27]} color="#d6b58c" />

      {/* Single-room shell */}
      <Box position={[0, 2.9, roomBackZ]} size={[6.4, 5.8, 0.16]} color={palette.wall} />
      <Box position={[-3.17, 2.9, roomCenterZ]} size={[0.16, 5.8, roomLength + 0.13]} color={palette.wallShade} />
      <Box position={[3.17, 2.9, roomCenterZ]} size={[0.16, 5.8, roomLength + 0.13]} color={palette.wall} />
      <Box position={[0, 2.86, roomCenterZ - roomLength / 2 + 0.1]} size={[5.98, 5.53, 0.025]} color="#f6f0e4" />
      <Box position={[-3.075, 2.86, roomCenterZ]} size={[0.025, 5.53, roomLength - 0.27]} color="#eee4d3" />

      {/* Clear centered entrance in the removable front elevation */}
      <group visible={showFrontWall}>
        <Box position={[-2.45, 2.55, roomFrontZ]} size={[1.5, 5.1, 0.16]} color={palette.wallShade} />
        <Box position={[2.45, 2.55, roomFrontZ]} size={[1.5, 5.1, 0.16]} color={palette.wallShade} />
        <Box position={[0, 5.25, roomFrontZ]} size={[3.4, 0.55, 0.16]} color={palette.wall} />
        <Box position={[-1.71, 2.55, roomFrontZ - 0.12]} size={[0.1, 5.1, 0.1]} color="#b88556" />
        <Box position={[1.71, 2.55, roomFrontZ - 0.12]} size={[0.1, 5.1, 0.1]} color="#b88556" />
      </group>
      <Box position={[0, 0.03, roomFrontZ - 0.32]} size={[1.9, 0.07, 0.46]} color="#aa7446" />
      <Box position={[0, 0.075, roomFrontZ - 0.32]} size={[1.55, 0.015, 0.25]} color="#e7cda7" />

      <group visible={showRoof}>
        <Box position={[0, 5.88, roomCenterZ]} size={[6.52, 0.18, roomLength + 0.22]} color="#77543d" />
        <Box position={[0, 5.77, roomCenterZ]} size={[6.42, 0.06, roomLength + 0.12]} color="#966943" />
      </group>

      <GroceryShelves />
      <ServiceArea />
      <BillingCounter />

      {/* Locked staff-only room separates the service operator from store customers */}
      <Box position={[-0.08, 2.9, (serviceRoomFrontZ + roomBackZ) / 2]} size={[0.14, 5.8, serviceRoomFrontZ - roomBackZ]} color="#e4d6c0" />
      <Box position={[-2.61, 2.9, serviceRoomFrontZ]} size={[0.94, 5.8, 0.16]} color="#e4d6c0" />
      <Box position={[-0.6, 2.9, serviceRoomFrontZ]} size={[0.96, 5.8, 0.16]} color="#e4d6c0" />
      <Box position={[-1.6, 5.25, serviceRoomFrontZ]} size={[1.04, 0.55, 0.16]} color="#e4d6c0" />
      {/* Closed door: a solid lower panel and glazed upper panel keep the room private but visible. */}
      <Box position={[-1.6, 0.7, serviceRoomFrontZ + 0.13]} size={[0.98, 1.3, 0.12]} color="#806044" radius={0.025} />
      <GlassPanel position={[-1.6, 1.89, serviceRoomFrontZ + 0.15]} size={[0.87, 0.98, 0.035]} />
      <Box position={[-1.6, 1.39, serviceRoomFrontZ + 0.18]} size={[0.91, 0.07, 0.06]} color="#b48b60" radius={0.012} />
      <Box position={[-1.6, 2.4, serviceRoomFrontZ + 0.18]} size={[0.91, 0.07, 0.06]} color="#b48b60" radius={0.012} />
      <Box position={[-2.06, 1.89, serviceRoomFrontZ + 0.18]} size={[0.06, 0.98, 0.06]} color="#b48b60" />
      <Box position={[-1.14, 1.89, serviceRoomFrontZ + 0.18]} size={[0.06, 0.98, 0.06]} color="#b48b60" />
      <Box position={[-1.27, 1.04, serviceRoomFrontZ + 0.2]} size={[0.12, 0.2, 0.035]} color="#d3ae69" radius={0.018} />
      <Cylinder position={[-1.27, 1.04, serviceRoomFrontZ + 0.23]} radius={0.045} height={0.04} color="#785633" rotation={[Math.PI / 2, 0, 0]} />
      <Label position={[-1.6, 2.88, serviceRoomFrontZ + 0.23]} color="#9a422f">LOCKED · PRIVATE STAFF ONLY</Label>
      <Label position={[-1.6, 0.3, serviceRoomFrontZ + 0.23]} color="#9a422f">NO PUBLIC ENTRY</Label>

      {/* Area markers on the shared open floor */}
      <Box position={[-1.64, 0.035, -8.65]} size={[2.5, 0.025, 0.06]} color="#4eaaa2" />
      <Box position={[1.63, 0.035, 2.72]} size={[2.5, 0.025, 0.06]} color="#dfa346" />
    </group>
  );
}

function Scene({ showRoof, showFrontWall }) {
  const controls = useRef(null);

  useEffect(() => {
    const reset = () => controls.current?.reset();
    window.addEventListener('shop-reset-view', reset);
    return () => window.removeEventListener('shop-reset-view', reset);
  }, []);

  return (
    <>
      <color attach="background" args={['#e8e5de']} />
      <fog attach="fog" args={['#e8e5de', 22, 42]} />
      <PerspectiveCamera makeDefault position={[0.8, 12.4, 22]} fov={36} near={0.1} far={100} />
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 2.1, -2.98]}
        minDistance={8}
        maxDistance={28}
        maxPolarAngle={Math.PI * 0.49}
        minPolarAngle={0.25}
        enableDamping
        dampingFactor={0.07}
      />
      <ambientLight intensity={1.15} />
      <hemisphereLight args={['#fff4df', '#8c775e', 1.15]} />
      <directionalLight
        position={[-5, 10, 7]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-bias={-0.00015}
      />
      <directionalLight position={[5, 7, -4]} intensity={1.4} color="#ffe2ae" />
      <ShopRoom showRoof={showRoof} showFrontWall={showFrontWall} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.17} />
      </mesh>
    </>
  );
}

function ToggleButton({ active, onClick, icon: Icon, children }) {
  return (
    <button className={`tool-button${active ? ' is-active' : ''}`} onClick={onClick} type="button">
      <Icon size={15} strokeWidth={1.8} />
      <span>{children}</span>
      <span className="toggle-indicator" aria-hidden="true">{active ? 'ON' : 'OFF'}</span>
    </button>
  );
}

export default function App() {
  const [showRoof, setShowRoof] = useState(false);
  const [showFrontWall, setShowFrontWall] = useState(false);

  const resetView = () => {
    window.dispatchEvent(new CustomEvent('shop-reset-view'));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Corner Shop home">
          <span className="brand-mark"><Store size={18} strokeWidth={1.8} /></span>
          <span className="brand-name">CORNER<span>SHOP</span></span>
        </a>
        <div className="topbar-meta"><span className="live-dot" /> INTERACTIVE 3D STUDY</div>
        <div className="topbar-right">INDIA <span className="topbar-divider">/</span> 01 ROOM</div>
      </header>

      <section className="stage">
        <Canvas shadows dpr={[1, 1.7]} gl={{ antialias: true, alpha: false }}>
          <Scene showRoof={showRoof} showFrontWall={showFrontWall} />
        </Canvas>

        <div className="intro-card">
          <p className="eyebrow"><span>01</span> A SMALL BUSINESS, UNDER ONE ROOF</p>
          <h1>Two trades.<br /><em>One corner.</em></h1>
          <p className="intro-copy">A long neighborhood store leads to a locked, staff-only online service office at the far end.</p>
          <div className="intro-tags"><span>6.2 × 15 m</span><span>ONE OPEN STORE + PRIVATE OFFICE</span><span>2 PEOPLE</span></div>
        </div>

        <div className="area-note area-note-left">
          <span className="note-number">01</span>
          <div><strong>Online services · locked rear room</strong><small>Staff only · no public entry</small></div>
        </div>
        <div className="area-note area-note-right">
          <span className="note-number note-gold">02</span>
          <div><strong>General store</strong><small>Groceries · stationery · home</small></div>
        </div>

        <aside className="scene-tools" aria-label="Scene display controls">
          <p className="tools-heading">CUTAWAY VIEW <span>01 / 01</span></p>
          <ToggleButton active={showRoof} onClick={() => setShowRoof((value) => !value)} icon={showRoof ? Eye : EyeOff}>
            Roof
          </ToggleButton>
          <ToggleButton active={showFrontWall} onClick={() => setShowFrontWall((value) => !value)} icon={showFrontWall ? Eye : EyeOff}>
            Front wall
          </ToggleButton>
          <div className="tools-rule" />
          <div className="people-count"><span className="count-number">02</span><span>PEOPLE IN SCENE</span></div>
        </aside>

        <div className="scene-caption">
          <span className="caption-line" />
          <span>ORDERED SHOP AISLES · LOCKED SERVICE OFFICE AT THE FAR END</span>
        </div>
      </section>

      <footer className="bottombar">
        <div className="people-legend">
          <span className="legend-item"><i className="legend-dot legend-teal" /> SERVICE OPERATOR</span>
          <span className="legend-item"><i className="legend-dot legend-saffron" /> STOREKEEPER</span>
        </div>
        <div className="interaction-hint"><span className="mouse-glyph">↗</span> DRAG TO ORBIT <span className="hint-divider">·</span> SCROLL TO ZOOM</div>
        <button className="reset-button" type="button" onClick={resetView}><RotateCcw size={14} /> RESET VIEW</button>
      </footer>
    </main>
  );
}
