import { AnyComponent, System } from '../core'
import { Collider, Transform, Tag } from '../components'

export const AABB = ({ x1, x2, y1, y2 }, { _x1, _x2, _y1, _y2 }): boolean => {
  return x1 < _x2 && x2 > _x1 && y1 < _y2 && y2 > _y1
}

type updatableNodes = Map<string, Collider | Transform | Tag>

export class Physics extends System {
  reqiuredComponents = new Map().set('general', [AnyComponent]).set('componentUpdate', [Collider, Transform, Tag])

  updateFrequency: number = 1000 / 24

  iterationFlag: boolean = false
  static debug: boolean = false

  onBeforeUpdate(): void {
    this.iterationFlag = !this.iterationFlag
  }

  update(deltaTime: number): void {
    this.onBeforeUpdate()
    const updatable = this.getNodes('componentUpdate') as Array<updatableNodes>
    for (let i = 0; i < updatable.length; i++) {
      this.physicsUpdate(deltaTime, updatable[i], updatable)
    }
  }

  physicsUpdate(dt: number, nodes: updatableNodes, allNodes: Array<updatableNodes>): void {
    const tagComponent = nodes.get('Tag') as Tag
    const transformComponent = nodes.get('Transform') as Transform
    const colliderComponent = nodes.get('Collider') as Collider
    const { position } = transformComponent
    const { collider } = colliderComponent
    const x1 = position.x
    const x2 = position.x + collider[2]
    const y1 = position.y
    const y2 = position.y + collider[3]

    colliderComponent.clearCollisions(this.iterationFlag)

    for (let i = 0; i < allNodes.length; i++) {
      const targetCollider = allNodes[i].get('Collider') as Collider
      if (colliderComponent === targetCollider || !allNodes[i].size) continue
      const collision = this.checkCollision({ x1, x2, y1, y2 }, allNodes[i])

      // TODO: refactor, TEMP
      // TODO move check method to collider for cleaner code and easier support of multiple types of collider
      if (collision) {
        const targetTag = allNodes[i].get('Tag') as Tag
        colliderComponent.addCollision(this.iterationFlag, {
          tag: targetTag.get(),
          entity: targetCollider.entity,
        })

        targetCollider.addCollision(this.iterationFlag, {
          tag: tagComponent.get(),
          entity: colliderComponent.entity,
        })
        break
      }
    }
  }

  checkCollision({ x1, x2, y1, y2 }, nodes: Map<string, Collider | Transform | Tag>): boolean {
    const { position } = nodes.get('Transform') as Transform
    const { collider } = nodes.get('Collider') as Collider

    const _x1 = position.x
    const _x2 = position.x + collider[2]
    const _y1 = position.y
    const _y2 = position.y + collider[3]

    return AABB({ x1, x2, y1, y2 }, { _x1, _x2, _y1, _y2 })
  }
}
