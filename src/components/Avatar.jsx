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

    // Keep model fixed
    if (group.current) {
      group.current.position.set(0, -1.1, 0)
      group.current.rotation.set(0, 0, 0)
    }

    // Lower arms from T-pose (MetaPerson / Mixamo style names)
    if (b.LeftArm) {
      b.LeftArm.rotation.z = THREE.MathUtils.degToRad(-70)
    }
    if (b.RightArm) {
      b.RightArm.rotation.z = THREE.MathUtils.degToRad(70)
    }

    // Slight elbow bend
    if (b.LeftForeArm) {
      b.LeftForeArm.rotation.z = THREE.MathUtils.degToRad(-10)
    }
    if (b.RightForeArm) {
      b.RightForeArm.rotation.z = THREE.MathUtils.degToRad(10)
    }

    // Light idle on spine
    if (b.Spine1) {
      b.Spine1.rotation.x = Math.sin(t * 1.1) * 0.025
      b.Spine1.rotation.y = Math.sin(t * 0.5) * 0.03
    }

    // Gentle head look
    if (b.Head) {
      b.Head.rotation.y = Math.sin(t * 0.45) * 0.06
      b.Head.rotation.x = Math.sin(t * 0.7) * 0.025
    }
  })

  return (
    <group ref={group} position={[0, -1.1, 0]} scale={1.0}>
      <primitive object={scene} />
    </group>
  )
}
