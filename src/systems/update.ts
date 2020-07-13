import { System, AnyComponent } from '../core'

export class UpdateSystem extends System {
  reqiuredComponents = new Map().set('general', [AnyComponent])
  updateFrequency = 1000 / 60

  update(deltaTime: number): void {
    const query = this.getNodes('general') || []
    for (let i = 0; i < query.length; i++) {
      for (const component of query[i].values()) {
        if (component.update) {
          component.update(deltaTime)
        }
      }
    }
  }
}
