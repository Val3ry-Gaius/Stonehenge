import { Profile } from '../../../lib/profiler/profile';
import { Role } from '../role';

import { StructureManager } from '../../../shared/structureManager';

/**
 * An RoadMaintainer repairs roads in their room.
 *
 * @todo Refactor this.
 */
export class RoadMaintainer extends Role {
  private structureManager: StructureManager;

  /**
   * Creates an instance of RoadMaintainer.
   * @param {Creep} creep The current creep.
   *
   * @memberOf RoadMaintainer
   */
  constructor(creep: Creep) {
    super(creep);

    this.structureManager = new StructureManager(creep.room);
  }

  /**
   * Run the module
   */
  @Profile()
  public run (): void {
    if (_.sum(this.creep.carry) > 0) {
      let structuresToRepair = this.getStructuresToRepair(this.structureManager.structures);

      if (structuresToRepair) {
        if (this.creep.pos.isNearTo(structuresToRepair[0])) {
          this.creep.repair(structuresToRepair[0]);
        } else {
          this.moveTo(structuresToRepair[0]);
        }
      }
    } else {
      this.tryRetrieveEnergy();
    }
  }

  /**
   * Get an array of roads that needs repair.
   *
   * Returns `undefined` if there are no roads to be repaired.
   *
   * @private
   * @param {Structure[]} structures The list of structures.
   * @returns {(Structure[] | undefined)} an array of roads to repair.
   *
   * @memberOf RoadMaintainer
   */
  @Profile()
  private getStructuresToRepair (structures: Structure[]): Structure[] | undefined {
    let targets: Structure[] = structures.filter((structure: Structure) => {
      return ((structure.structureType === STRUCTURE_ROAD) && structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1)));
    });

    return targets;
  }
}