import { Component } from '../core'

export class Tag extends Component {
  tag: string = Math.random().toString()

  onAwake(): void {}

  update(): void {}

  set(tag: string): void {
    this.tag = tag
  }

  get(): string {
    return this.tag
  }
}
