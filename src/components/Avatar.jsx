import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Avatar({ isSpeaking, mouthOpen }) {
  const group = useRef()
  const mouth = useRef()
  const leftEye = useRef()
  const rightEye = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.5) * 0.05
      group.current.rotation.y = Math.sin(t * 0.4) * 0.15
    }
    if (mouth.current) {
      const target = isSpeaking ? 0.15 + mouthOpen * 0.4 : 0.05
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, target, 0.15)
    }
    // Simple blink
    if (leftEye.current && rightEye.current) {
      const blink = Math.sin(t * 0.8) > 0.95 ? 0.1 : 1
      leftEye.current.scale.y = blink
      rightEye.current.scale.y = blink
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.35, 0.8, 4, 16]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEye} position={[-0.12, 1.62, 0.28]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh ref={rightEye} position={[0.12, 1.62, 0.28]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouth} position={[0, 1.42, 0.32]}>
        <boxGeometry args={[0.18, 0.08, 0.04]} />
        <meshStandardMaterial color="#c45c5c" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.75, -0.05]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#3d2b1f" />
      </mesh>
    </group>
  )
}
