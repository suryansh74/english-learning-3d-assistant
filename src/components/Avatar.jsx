import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Avatar({ isSpeaking, mouthOpen }) {
  const group = useRef()
  const { scene } = useGLTF('/models/assistant.glb')

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.1) * 0.03
      group.current.rotation.y = Math.sin(t * 0.3) * 0.08
    }
  })

  return (
    <group ref={group} position={[0, -1.2, 0]} scale={1.1}>
      <primitive object={scene} />
    </group>
  )
}
