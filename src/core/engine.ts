import { Entity } from './entity'
import { System } from './system'
import { Scene } from './scene'

export interface Dictionary<T> {
  [name: string]: T
}

type systemsArray = Array<System>

export class Engine {
  static systems: systemsArray = []
  static updatableSystems: systemsArray = []
  static entities: Set<Entity> = new Set()
  static lastTime: number = 0
  static loopId: number = 0
  static scenes: Map<string, Scene> = new Map()
  static entityWasDeleted: boolean = false

  static addSystem(system: System): void {
    Engine.systems.push(system)
    if (system.updateFrequency) {
      Engine.updatableSystems.push(system)
    }
    system.onAwake()
  }

  static removeSystem(): void {}

  static addEntity(entity: Entity): void {
    for (const system of this.systems.values()) {
      system.processEntity(entity)
    }

    for (const component of entity.getAllComponents().values()) {
      component.onAwake()
    }

    Engine.entities.add(entity)
  }

  static removeEntity(entity: Entity): void {
    Engine.entityWasDeleted = true
    entity.remove()
    Engine.entities.delete(entity)
  }

  static removeEntityById(id: number): void {
    for (const entity of this.entities) {
      if (entity.id === id) {
        Engine.removeEntity(entity)
      }
    }
  }

  static update(timeStamp: number): void {
    if (Engine.entityWasDeleted) {
      for (let i = 0; i < Engine.systems.length; i++) {
        Engine.systems[i].removeDeletedComponents()
      }
      Engine.entityWasDeleted = false
    }
    for (let i = 0; i < Engine.updatableSystems.length; i++) {
      const system = Engine.updatableSystems[i]
      const deltaTime = timeStamp - system.lastTime
      if (deltaTime > system.updateFrequency) {
        system.update(deltaTime)
        system.lastTime = timeStamp - (deltaTime % system.updateFrequency)
      }
    }
  }

  static spawnError(text: string): void {
    // eslint-disable-next-line
    console.error(text)
  }

  static startLoop(): void {
    Engine.lastTime = performance.now()
    if (!Engine.loopId) {
      Engine.loop(this.lastTime)
    }
  }

  static loop(timeStamp: number): void {
    Engine.update(timeStamp)
    Engine.loopId = requestAnimationFrame(Engine.loop)
  }

  static addScene(alias: string, scene: Scene): void {
    Engine.scenes.set(alias, scene)
  }

  static getScene(alias: string): Scene | undefined {
    return Engine.scenes.get(alias)
  }
}
