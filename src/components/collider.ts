import { Component, Entity } from '../core'
import { Transform } from './transform'

type collider = [number, number, number, number]

export type collision = {
  tag: string
  entity: Entity
}
export class Collider extends Component {
  transform: Transform
  collider: Array<number> = [0, 0, 1, 1]
  collisions: Array<collision> = []
  collisionWasChecked: boolean = false

  onAwake(): void {
    this.transform = this.getComponent(Transform)

    const scale = this.transform.getScale()
    this.updateCollider([0, 0, scale.x, scale.y])
  }

  constructor(collider?: collider) {
    super()
    if (collider) {
      this.collider = collider
    }
  }

  updateCollider(collider: collider): void {
    this.collider = [...collider]
  }

  getCollider(): Array<number> {
    return this.collider
  }

  clearCollisions(flag: boolean): void {
    if (flag === this.collisionWasChecked) return

    this.collisions.length = 0
    this.collisionWasChecked = flag
  }

  addCollision(flag: boolean, collision: collision): void {
    if (flag !== this.collisionWasChecked) {
      this.clearCollisions(flag)
    }

    this.collisions.push(collision)
  }
}
