import { Component } from '../core'
import { Point } from '../helpers'
import { Transform, IPosition } from './transform'

export class Renderer extends Component {
  transform: Transform
  position: IPosition
  color: string = ''
  static width: number = 0
  static height: number = 0

  onAwake(): void {
    this.transform = this.getComponent(Transform)
    this.position = this.transform.getPosition()
  }

  update(): void {}

  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    ctx.fillStyle = this.color
    ctx.fillRect(x, y, this.transform.scale.x, this.transform.scale.y)
  }

  drawPath(ctx: CanvasRenderingContext2D, path: Array<Point>, offset: Point): void {
    ctx.beginPath()
    ctx.moveTo(path[0].x + offset.x, path[0].y + offset.y)
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(offset.x + path[i].x, offset.y + path[i].y)
    }
    ctx.closePath()
  }

  static getWidth(): number {
    return this.width
  }

  static getHeight(): number {
    return this.height
  }

  static setWidth(width: number): void {
    Renderer.width = width
  }

  static setHeight(height: number): void {
    Renderer.height = height
  }
}
