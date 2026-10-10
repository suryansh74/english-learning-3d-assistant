import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Avatar({ isSpeaking, mouthOpen }) {
  const group = useRef()
  const mouth = useRef()
  const leftEye = useRef()
  const rightEye = useRef()
  const leftPupil = useRef()
  const rightPupil = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.2) * 0.04
      group.current.rotation.y = Math.sin(t * 0.35) * 0.12
    }
    if (mouth.current) {
      const target = isSpeaking ? 0.12 + mouthOpen * 0.55 : 0.04
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, target, 0.18)
    }
    // Blink
    if (leftEye.current && rightEye.current) {
      const blink = Math.sin(t * 0.7) > 0.96 ? 0.15 : 1
      leftEye.current.scale.y = blink
      rightEye.current.scale.y = blink
    }
  })

  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.38, 0.9, 8, 16]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.4} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" roughness={0.5} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.78, -0.04]}>
        <sphereGeometry args={[0.44, 32, 32]} />
        <meshStandardMaterial color="#2c1e14" />
      </mesh>

      {/* Eyes (whites) */}
      <mesh ref={leftEye} position={[-0.14, 1.62, 0.32]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh ref={rightEye} position={[0.14, 1.62, 0.32]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pupils */}
      <mesh ref={leftPupil} position={[-0.14, 1.62, 0.37]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={rightPupil} position={[0.14, 1.62, 0.37]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouth} position={[0, 1.40, 0.36]}>
        <boxGeometry args={[0.16, 0.07, 0.05]} />
        <meshStandardMaterial color="#d46a6a" />
      </mesh>

      {/* Simple arms */}
      <mesh position={[-0.48, 0.85, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      <mesh position={[0.48, 0.85, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Simple hands */}
      <mesh position={[-0.58, 0.52, 0.05]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.58, 0.52, 0.05]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
    </group>
  )
}
