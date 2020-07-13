import { Component } from '../core'

export interface IPosition {
  x: number
  y: number
  z: number
}

export interface IPivot {
  x: number
  y: number
  z: number
}
export interface IScale {
  x: number
  y: number
  z: number
}
// TODO: matrixes
export class Transform extends Component {
  position: IPosition = { x: 0, y: 0, z: 0 }
  rotation: number = 0
  scale: IScale = { x: 1, y: 1, z: 1 }
  pivot: IPivot = { x: 0, y: 0, z: 0 }

  update(): void {}

  getPosition(): IPosition {
    return this.position
  }

  getRotation(): number {
    return this.rotation
  }

  getScale(): IScale {
    return this.scale
  }

  setPosition(position: IPosition): void {
    this.position.x = position.x
    this.position.y = position.y
    this.position.z = position.z
  }

  setRotation(angle: number): void {
    this.rotation = angle
  }

  getPivot(): IPivot {
    return this.pivot
  }

  setPivot(pivot: IPivot): void {
    this.pivot = { ...pivot }
  }

  setScale(x: number, y: number, z: number): void {
    this.scale.x = x
    this.scale.y = y
    this.scale.z = z
  }
}
