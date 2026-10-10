import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Avatar({ isSpeaking, mouthOpen }) {
  const group = useRef()
  const { scene } = useGLTF('/models/assistant.glb')

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!group.current) return

    // Gentle breathing
    const breath = Math.sin(t * 1.4) * 0.015
    group.current.position.y = -1.2 + breath

    // Subtle sway
    group.current.rotation.y = Math.sin(t * 0.35) * 0.08
    group.current.rotation.z = Math.sin(t * 0.5) * 0.015

    // Slight head-like tilt on the whole body (simple for now)
    group.current.rotation.x = Math.sin(t * 0.6) * 0.02
  })

  return (
    <group ref={group} position={[0, -1.2, 0]} scale={1.05}>
      <primitive object={scene} />
    </group>
  )
}
