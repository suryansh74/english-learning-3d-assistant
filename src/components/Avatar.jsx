import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Avatar({ isSpeaking, mouthOpen }) {
  const group = useRef()
  const { scene } = useGLTF('/models/assistant.glb')
  const bones = useRef({})

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isBone) {
        bones.current[obj.name] = obj
      }
    })
    console.log('Bones loaded:', Object.keys(bones.current).length)
  }, [scene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const b = bones.current

    // Keep model centered and fixed
    if (group.current) {
      group.current.position.set(0, -1.05, 0)
      group.current.rotation.set(0, 0, 0)
    }

    // --- Rest pose: lower arms ---
    // MetaPerson / Mixamo style: rotate around local X or Z depending on bind
    if (b.LeftArm) {
      b.LeftArm.rotation.set(0, 0, THREE.MathUtils.degToRad(-65))
    }
    if (b.RightArm) {
      b.RightArm.rotation.set(0, 0, THREE.MathUtils.degToRad(65))
    }

    // Slight forearm bend
    if (b.LeftForeArm) {
      b.LeftForeArm.rotation.set(0, 0, THREE.MathUtils.degToRad(-15))
    }
    if (b.RightForeArm) {
      b.RightForeArm.rotation.set(0, 0, THREE.MathUtils.degToRad(15))
    }

    // --- Basic idle animation ---
    // Soft spine breathing
    if (b.Spine1) {
      b.Spine1.rotation.x = Math.sin(t * 1.3) * 0.03
      b.Spine1.rotation.y = Math.sin(t * 0.45) * 0.04
    }
    if (b.Spine2) {
      b.Spine2.rotation.x = Math.sin(t * 1.3 + 0.3) * 0.02
    }

    // Head gentle look around
    if (b.Head) {
      b.Head.rotation.y = Math.sin(t * 0.4) * 0.12
      b.Head.rotation.x = Math.sin(t * 0.65) * 0.04
    }

    // Subtle shoulder movement
    if (b.LeftShoulder) {
      b.LeftShoulder.rotation.z = Math.sin(t * 0.8) * 0.05
    }
    if (b.RightShoulder) {
      b.RightShoulder.rotation.z = Math.sin(t * 0.8 + Math.PI) * 0.05
    }
  })

  return (
    <group ref={group} position={[0, -1.05, 0]} scale={1.05}>
      <primitive object={scene} />
    </group>
  )
}
