import { Component, AnyComponent } from './component'
import { Entity, EntityComponents } from './entity'

type queryName = string
type componentsMap = Map<string, Component>
export class System {
  protected static _instances: Array<System> = []

  public id: number
  public name: string
  public priority: number = 0
  public updateFrequency: number = 0
  public isActive: boolean = true
  public reqiuredComponents: Map<queryName, Array<string | { new (): Component }>> = new Map()

  public queries: Map<queryName, Array<componentsMap>> = new Map()
  public providedMethods: Set<string> = new Set()
  public deltaTime: number = 0
  public lastTime: number = 0

  constructor() {
    this.name = this.constructor.name

    if (System._instances[this.constructor.name]) {
      return System._instances[this.constructor.name]
    }

    System._instances[this.constructor.name] = this
  }

  private mapEnitityComponents(components: EntityComponents): componentsMap {
    const result: Map<string, Component> = new Map()

    for (let i = 0; i < components.length; i++) {
      const component = components[i]
      result.set(component.name, component)
    }

    return result
  }

  public processEntity(entity: Entity): void {
    for (const [name, query] of this.reqiuredComponents.entries()) {
      const existingNodes = this.queries.get(name) || []
      if (query.includes(AnyComponent)) {
        this.queries.set(name, [...existingNodes, this.mapEnitityComponents(entity.getAllComponents())])
        this.onNodesUpdate()
      } else if (entity.hasAllComponents(query)) {
        this.queries.set(name, [...existingNodes, this.mapEnitityComponents(entity.getComponents(query))])
        this.onNodesUpdate()
      }
    }
  }

  public removeDeletedComponents(): void {
    for (const node of this.queries.values()) {
      for (let i = 0; i < node.length; i++) {
        const componentsMap = node[i]
        for (const component of componentsMap.values()) {
          if (component.tobeDeleted()) {
            componentsMap.clear()
            node.splice(i, 1)
            --i
          }
        }
      }
    }
    this.onNodesUpdate()
  }

  public onAwake(): void {}
  // eslint-disable-next-line
  public update(deltaTime?: number): void {}

  public getNodes<T extends Component>(queryName: string): Array<Map<string, T>> {
    return (this.queries.get(queryName) as Array<Map<string, T>>) || []
  }

  public onNodesUpdate(): void {}
}
