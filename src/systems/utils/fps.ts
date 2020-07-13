import { System } from '../../core/index'

export class FpsCounter extends System {
  counter: number = 0
  updateInterval: number = 0
  domNode: HTMLElement
  frames: number = 0
  prevTime: number = 0
  domId: string = 'fps-counter'
  updateFrequency: number = 1000 / 60

  constructor() {
    super()
    this.domNode = document.getElementById(this.domId) || document.createElement('div')
    this.domNode.id = this.domId
    this.domNode.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      zIndex: 100;
    `
    document.body.appendChild(this.domNode)
    this.updateInterval = !this.updateInterval
      ? window.setInterval(() => {
          this.domNode.innerHTML = String(this.counter)
        }, 250)
      : 0
  }

  update(): void {
    const time = Date.now()
    this.frames++

    if (time >= this.prevTime + 500) {
      this.counter = Math.round((this.frames * 1000) / (time - this.prevTime))
      this.prevTime = time
      this.frames = 0
    }
  }
}
