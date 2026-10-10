import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Avatar({ isSpeaking, mouthOpen }) {
  const group = useRef()
  const { scene } = useGLTF('/models/assistant.glb')
  const bones = useRef({})

  // Find and cache important bones once
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isBone) {
        const name = obj.name.toLowerCase()
        // Common MetaPerson / Mixamo-style bone names
        if (name.includes('leftarm') || name.includes('left_arm') || name === 'leftarm') {
          bones.current.leftUpperArm = obj
        }
        if (name.includes('rightarm') || name.includes('right_arm') || name === 'rightarm') {
          bones.current.rightUpperArm = obj
        }
        if (name.includes('spine') || name.includes('chest')) {
          bones.current.spine = obj
        }
        if (name.includes('head') && !name.includes('headtop')) {
          bones.current.head = obj
        }
      }
    })

    // Log bones so you can see what is available
    console.log('Available bones:', Object.keys(bones.current))
  }, [scene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Keep whole model fixed in place
    if (group.current) {
      group.current.position.set(0, -1.15, 0)
      group.current.rotation.set(0, 0, 0)
    }

    // Lower arms from T-pose (simple rest pose)
    if (bones.current.leftUpperArm) {
      bones.current.leftUpperArm.rotation.z = THREE.MathUtils.degToRad(-75)
    }
    if (bones.current.rightUpperArm) {
      bones.current.rightUpperArm.rotation.z = THREE.MathUtils.degToRad(75)
    }

    // Light idle on spine
    if (bones.current.spine) {
      bones.current.spine.rotation.x = Math.sin(t * 1.2) * 0.03
      bones.current.spine.rotation.y = Math.sin(t * 0.6) * 0.04
    }

    // Gentle head movement
    if (bones.current.head) {
      bones.current.head.rotation.y = Math.sin(t * 0.5) * 0.08
      bones.current.head.rotation.x = Math.sin(t * 0.8) * 0.03
    }
  })

  return (
    <group ref={group} position={[0, -1.15, 0]} scale={1.0}>
      <primitive object={scene} />
    </group>
  )
}
