import { getId } from '../helpers'
import { Entity } from './entity'
import { Scene } from './scene'
import { Engine } from './engine'

interface IConstructor<T> {
  new (): T
}

class SystemsCallbacks {
  [key: string]: any
}

export class Component extends SystemsCallbacks {
  public id: number
  public name: string
  public entity: Entity
  public isActive: boolean = true
  private isDeleted: boolean = false

  constructor() {
    super()
    this.id = getId()
    this.name = this.constructor.name
  }

  public getComponent<T extends Component>(name: string | IConstructor<T>): T {
    return this.entity.getComponent(name)
  }

  public onAwake(): void {}

  public disable(): void {
    this.isActive = false
  }

  public enable(): void {
    this.isActive = true
  }

  public getScene(): Scene {
    return this.entity.getScene()
  }

  public destroy(): void {
    Engine.removeEntity(this.entity)
  }

  public remove(): void {
    this.isDeleted = true
  }

  public tobeDeleted(): boolean {
    return this.isDeleted
  }

  public setEntity(entity: Entity): void {
    this.entity = entity
  }
}

export class AnyComponent extends Component {}
