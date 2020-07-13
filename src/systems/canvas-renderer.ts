import { Transform, Renderer, Collider } from '../components'
import { System } from '../core'
import { Physics } from './physics'

const defaultStyle = `
  position: absolute;
  width: 100%;
  height: 100%;
  user-select: none;
`
type renderableNodes = Map<string, Renderer | Transform>

export class CanvasRenderer extends System {
  reqiuredComponents = new Map().set('renderable', [Renderer, Transform])

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  observer: MutationObserver
  domId: string = 'renderer'
  private static parentEl: HTMLElement
  updateFrequency: number = 1000 / 60

  constructor(parent = document.body, style = defaultStyle) {
    super()
    this.canvas = (document.getElementById(this.domId) as HTMLCanvasElement) || document.createElement('canvas')
    this.canvas.id = this.domId
    parent.appendChild(this.canvas)
    this.canvas.style.cssText = style
    this.ctx = this.canvas.getContext('2d')
    CanvasRenderer.parentEl = parent

    window.addEventListener('resize', this.onCanvasResize.bind(this))

    const observerConfig = { attributes: true, childList: true, subtree: true }
    this.observer = new MutationObserver(this.onContainerMutation.bind(this))
    this.observer.observe(parent, observerConfig)

    this.onCanvasResize()
  }

  static getParentEl(): HTMLElement {
    return this.parentEl
  }

  onBeforeUpdate(): void {
    if (!this.ctx) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  update(deltaTime: number): void {
    this.onBeforeUpdate()
    const query = this.getNodes('renderable') as Array<renderableNodes>
    for (let i = 0; i < query.length; i++) {
      this.draw(deltaTime, query[i])
    }
  }

  // TODO: draw in order of Z axis value
  draw(dt: number, nodes: renderableNodes): void {
    if (!this.ctx) return
    const renderer = nodes.get('Renderer') as Renderer
    const transform = nodes.get('Transform') as Transform
    const {
      position: { x, y },
      rotation,
      pivot,
    } = transform

    if (Physics.debug) {
      const colliderComponent = transform.getComponent(Collider)
      if (colliderComponent) {
        const { collider } = colliderComponent
        this.ctx.beginPath()
        this.ctx.strokeStyle = '#fff'
        this.ctx.rect(x, y, collider[2], collider[3])
        this.ctx.moveTo(x + pivot.x, y + pivot.y)
        this.ctx.arc(x + pivot.x, y + pivot.y, 1, 0, Math.PI * 2, true)
        this.ctx.closePath()
        this.ctx.stroke()
      }
    }

    if (rotation !== 0) {
      this.ctx.save()
      this.ctx.translate(x + pivot.x, y + pivot.y)
      this.ctx.rotate(rotation)
      this.ctx.translate(-(x + pivot.x), -(y + pivot.y))
      renderer.draw(this.ctx, x, y)
      this.ctx.restore()
    } else {
      this.ctx.save()
      renderer.draw(this.ctx, x, y)
      this.ctx.restore()
    }
  }

  onContainerMutation(mutationsList: Array<MutationRecord>): void {
    for (const mutation of mutationsList) {
      if (mutation.attributeName === 'class') {
        this.onCanvasResize()
      }
    }
  }

  onCanvasResize(): void {
    const width = this.canvas.scrollWidth
    const height = this.canvas.scrollHeight

    this.updateCanvasSize(width, height)
  }

  updateCanvasSize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
    Renderer.setWidth(width)
    Renderer.setHeight(height)
  }
}
