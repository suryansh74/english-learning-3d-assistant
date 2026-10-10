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
    window.avatarBones = bones.current
  }, [scene])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const b = bones.current

    // Keep model fixed and centered
    if (group.current) {
      group.current.position.set(0, -0.95, 0)
      group.current.rotation.set(0, 0, 0)
    }

    // Rest pose – X axis worked well
    if (b.LeftArm) {
      b.LeftArm.rotation.set(THREE.MathUtils.degToRad(70), 0, 0)
    }
    if (b.RightArm) {
      b.RightArm.rotation.set(THREE.MathUtils.degToRad(70), 0, 0)
    }

    if (b.LeftForeArm) {
      b.LeftForeArm.rotation.set(THREE.MathUtils.degToRad(10), 0, 0)
    }
    if (b.RightForeArm) {
      b.RightForeArm.rotation.set(THREE.MathUtils.degToRad(10), 0, 0)
    }

    // Idle
    if (b.Spine1) {
      b.Spine1.rotation.x = Math.sin(t * 1.2) * 0.025
      b.Spine1.rotation.y = Math.sin(t * 0.4) * 0.03
    }
    if (b.Head) {
      b.Head.rotation.y = Math.sin(t * 0.35) * 0.08
      b.Head.rotation.x = Math.sin(t * 0.6) * 0.03
    }

    // Speaking animation
    if (isSpeaking) {
      if (b.Head) {
        b.Head.rotation.x += Math.sin(t * 4) * 0.06
      }
      if (b.LeftArm) {
        b.LeftArm.rotation.x += Math.sin(t * 2.5) * 0.15
      }
      if (b.RightArm) {
        b.RightArm.rotation.x += Math.sin(t * 2.5 + 1) * 0.15
      }
      if (b.Spine2) {
        b.Spine2.rotation.y = Math.sin(t * 1.8) * 0.05
      }
    }
  })

  return (
    <group ref={group} position={[0, -0.95, 0]} scale={1.0}>
      <primitive object={scene} />
    </group>
  )
}
