import { Profile } from '../../../lib/profiler/profile';
import { Role } from '../role';

/**
 * A Harvester occupies a mining position and harvests energy.
 */
export class Harvester extends Role {
  /**
   * Creates an instance of Harvester.
   * @param {Creep} creep The current creep.
   *
   * @memberOf Harvester
   */
  constructor (creep: Creep) {
    super(creep);
  }

  /**
   * Run the module.
   */
  @Profile()
  public run (): void {
    let availablePositions: RoomPosition[] = Memory.rooms[this.creep.room.name]
      .unoccupiedMiningPositions;
    let assignedPosition: RoomPosition;

    if (availablePositions.length > 0 && !this.creep.memory.occupiedMiningPosition) {
      this.creep.memory.occupiedMiningPosition = availablePositions.pop();
      assignedPosition = new RoomPosition(
        this.creep.memory.occupiedMiningPosition.x,
        this.creep.memory.occupiedMiningPosition.y,
        this.creep.memory.occupiedMiningPosition.roomName
      );
      Memory.rooms[this.creep.room.name].unoccupiedMiningPositions = availablePositions;
    } else {
      assignedPosition = new RoomPosition(
        this.creep.memory.occupiedMiningPosition.x,
        this.creep.memory.occupiedMiningPosition.y,
        this.creep.memory.occupiedMiningPosition.roomName
      );
    }

    if (this.creep.pos.isEqualTo(assignedPosition)) {
      let targetSource = this.creep.pos.findClosestByPath<Source>(FIND_SOURCES);
      this.tryHarvest(targetSource);
    } else {
      this.moveToPosition(assignedPosition, 1);
    }
  }

  /**
   * Attempt to harvest energy.
   *
   * @private
   * @param {Source} target The target energy source to harvest.
   * @returns {number} A status code.
   *
   * @memberOf Harvester
   */
  @Profile()
  private tryHarvest (target: Source): number {
    return this.creep.harvest(target);
  }
}
