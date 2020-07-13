import { System, Dictionary, Component, AnyComponent } from '../core'

interface IHandler {
  (event?: MouseEvent | KeyboardEvent): void
}

interface IPressedKeys {
  [name: string]: boolean
}

type listener = {
  IHandler: Function
  target?: HTMLElement
}

type handlers = Array<listener>

export class InputSystem extends System {
  reqiuredComponents = new Map().set('general', [AnyComponent])
  isMouseDown: boolean = false
  x: number = 0
  y: number = 0
  listeners: Dictionary<handlers> = {}
  pressedKeys: IPressedKeys = {}
  private static keys = {
    Up: false,
    Down: false,
    Left: false,
    Right: false,
    Mouse0: false,
    Mouse1: false,
    Mouse2: false,
    Action: false,
  }

  binds = {
    87: 'Up',
    38: 'Up',
    83: 'Down',
    40: 'Down',
    65: 'Left',
    37: 'Left',
    68: 'Right',
    39: 'Right',
    32: 'Action',
    17: 'Action',
  }

  constructor() {
    super()
    this.initListeners()
  }

  initListeners(): void {
    document.body.addEventListener('mousedown', this.handleMouseDown.bind(this))
    document.body.addEventListener('click', this.handleClick.bind(this))
    document.body.addEventListener('mouseup', this.handleMouseUp.bind(this))
    document.body.addEventListener('mousemove', this.handleMouseMove.bind(this))
    document.body.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.body.addEventListener('keyup', this.handleKeyUp.bind(this))
    document.body.addEventListener('keypress', this.handleKeyPress.bind(this))
    window.oncontextmenu = (): boolean => false
  }

  handleMouseDown(e: MouseEvent): void {
    this.isMouseDown = true
    this.dispatchEvents('mousedown', e)
  }

  handleMouseUp(e: MouseEvent): void {
    this.isMouseDown = false
    this.dispatchEvents('mouseup', e)
  }

  handleClick(e: MouseEvent): void {
    this.dispatchEvents('click', e)
  }

  dispatchEvents(alias: string, event: MouseEvent | KeyboardEvent): void {
    const handlers = this.listeners[alias]

    if (!handlers) return

    for (let i = 0; i < handlers.length; i++) {
      if (!handlers[i].target || handlers[i].target === event.target) {
        handlers[i].IHandler(event)
      }
    }
  }

  handleMouseMove(event: MouseEvent): void {
    const { offsetX, offsetY } = event

    this.x = offsetX
    this.y = offsetY
  }

  handleKeyDown(event: KeyboardEvent): void {
    const { keyCode } = event
    const key = this.binds[keyCode]
    this.pressedKeys[keyCode] = true
    InputSystem.keys[key] = true
    this.dispatchEvents('keydown', event)
  }

  handleKeyUp(event: KeyboardEvent): void {
    const { keyCode } = event
    const key = this.binds[keyCode]
    this.pressedKeys[keyCode] = false
    InputSystem.keys[key] = false
    this.dispatchEvents('keyup', event)
  }

  handleKeyPress(event: KeyboardEvent): void {
    this.dispatchEvents('keypress', event)
  }

  static getKey(key: string): boolean {
    return this.keys[key]
  }

  static isKeyPressed(alias: string): boolean {
    return InputSystem.keys[alias]
  }

  addEventListener(event: string, fn: IHandler, target?: HTMLElement): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push({
      IHandler: fn,
      target,
    })
  }

  removeEventListener(eventAlias: string, fn: IHandler): void {
    const handlers = this.listeners[eventAlias]
    const index = handlers.findIndex((item) => item.IHandler === fn)

    if (index !== -1) {
      handlers.splice(index, 1)
    }
  }

  onNodesUpdate(): void {
    this.listeners = {}
    const nodes: Array<Map<string, Component>> = this.getNodes('general')
    for (let i = 0; i < nodes.length; i++) {
      for (const component of nodes[i].values()) {
        if (component.onMouseDown) {
          this.addEventListener('mousedown', component.onMouseDown.bind(component))
        }

        if (component.onKeyPress) {
          this.addEventListener('keypress', component.onKeyPress.bind(component))
        }

        if (component.onClick) {
          this.addEventListener('click', component.onClick.bind(component))
        }
      }
    }
  }
}
