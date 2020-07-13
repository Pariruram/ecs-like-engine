import { Component } from '../core'
import { Transform, IPosition } from './transform'
import { Collider } from './collider'

export class PhysicsObject2D extends Component {
  transform: Transform
  collider: Collider
  position: IPosition
  velocity: number = 0.01
  angularVelocity: number = 0
  rotation: number = 0
  mass: number = 1
  slowSpeed: number = 0.001

  onAwake(): void {
    this.transform = this.getComponent(Transform)
    this.collider = this.getComponent(Collider)
    this.position = this.transform.getPosition()
  }

  update(dt: number): void {
    if (this.velocity > 0) {
      this.velocity -= this.slowSpeed
    }
    if (this.velocity < 0) {
      this.velocity = 0
    }

    let rotation = this.transform.getRotation()

    if (this.collider.collisions.length) {
      rotation += Math.PI
      this.transform.setRotation(rotation)
    }

    this.position.x += this.velocity * dt * Math.cos(rotation)
    this.position.y += this.velocity * dt * Math.sin(rotation)
  }

  getVelocity(): number {
    return this.velocity
  }

  setVelocity(velocity: number): void {
    this.velocity = velocity
  }

  getRotation(): number {
    return this.transform.getRotation()
  }

  setRotation(angle: number): void {
    this.rotation = angle
    this.transform.setRotation(angle)
  }
}
