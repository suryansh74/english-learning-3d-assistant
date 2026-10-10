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
      group.current.position.y = Math.sin(t * 1.1) * 0.03
      group.current.rotation.y = Math.sin(t * 0.3) * 0.1
    }
    if (mouth.current) {
      const target = isSpeaking ? 0.1 + mouthOpen * 0.6 : 0.03
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, target, 0.2)
    }
    if (leftEye.current && rightEye.current) {
      const blink = Math.sin(t * 0.65) > 0.97 ? 0.12 : 1
      leftEye.current.scale.y = blink
      rightEye.current.scale.y = blink
    }
  })

  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.42, 1.0, 8, 16]} />
        <meshStandardMaterial color="#5b9bd5" roughness={0.35} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" roughness={0.45} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.78, -0.05]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#1f1410" />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEye} position={[-0.13, 1.62, 0.3]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh ref={rightEye} position={[0.13, 1.62, 0.3]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Pupils */}
      <mesh position={[-0.13, 1.62, 0.35]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.13, 1.62, 0.35]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouth} position={[0, 1.42, 0.34]}>
        <boxGeometry args={[0.14, 0.06, 0.04]} />
        <meshStandardMaterial color="#c45c5c" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, 0.75, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        <meshStandardMaterial color="#5b9bd5" />
      </mesh>
      <mesh position={[0.5, 0.75, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        <meshStandardMaterial color="#5b9bd5" />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.62, 0.48, 0.05]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.62, 0.48, 0.05]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
    </group>
  )
}
