import { getId } from '../helpers'
import { Component } from './component'
import { Scene } from './scene'

export type Prefab = {
  name: string
  data: Array<{ new (): Component }>
}

export type EntityComponents = Array<Component>
type ComponentsIndexes = { [name: string]: number }

export class Entity {
  public id: number
  public scene: Scene
  public prefab: Prefab
  private components: EntityComponents = []
  private componentsIndexes: ComponentsIndexes = {}

  constructor() {
    this.id = getId()
  }

  public add(component: Component): void {
    component.setEntity(this)
    this.components.push(component)
    this.updateComponentsIndexes()
  }

  public getComponent<T extends Component>(name: string | { new (): T }): T {
    const key = typeof name === 'string' ? name : name.name
    const index = this.componentsIndexes[key]

    return this.components[index] as T
  }

  public getComponents(components: Array<string | { new (): Component }>): EntityComponents {
    const result: EntityComponents = []

    for (const item of components) {
      const component = this.getComponent(item)
      result.push(component)
    }

    return result
  }

  public getAllComponents(): EntityComponents {
    return this.components
  }

  public hasAllComponents(components: Array<string | { new (): Component }>): boolean {
    for (const component of components) {
      if (!this.getComponent(component)) return false
    }

    return true
  }

  public remove(): void {
    for (let i = 0; i < this.components.length; i++) {
      this.components[i].remove()
    }
  }

  public appendToScene(scene: Scene): void {
    this.scene = scene
  }

  public getScene(): Scene {
    return this.scene
  }

  private updateComponentsIndexes(): void {
    this.componentsIndexes = {}
    for (let i = 0; i < this.components.length; i++) {
      const { name } = this.components[i]
      this.componentsIndexes[name] = i
    }
  }
}
