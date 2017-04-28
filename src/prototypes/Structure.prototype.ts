export const loadStructurePrototypes = function () {
  Structure.prototype.needEnergy = function () {
    if (this.structureType !== STRUCTURE_EXTENSION &&
      this.structureType !== STRUCTURE_TOWER) {
      return false;
    } else if (this.structureType === STRUCTURE_TOWER) {
      return this.energy < 100;
    }
    return this.energy < this.energyCapacity;
  };
};
