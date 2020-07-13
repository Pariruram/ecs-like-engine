import { getId } from '../helpers'
import { Entity } from './entity'
import { Engine } from './engine'

export class Scene {
  id: number = getId()
  idList: Array<number> = []

  add(entity: Entity): void {
    entity.appendToScene(this)
    Engine.addEntity(entity)
    this.idList.push(entity.id)
  }

  remove(entity: Entity): void {
    Engine.removeEntity(entity)
  }

  clear(): void {
    for (let i = 0; i < this.idList.length; i++) {
      Engine.removeEntityById(this.idList[i])
    }
    this.idList = []
  }
}
