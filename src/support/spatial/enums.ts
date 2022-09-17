export enum Direction {
  Forwards=0,
  Backwards,
  Up,
  Down,
  Left,
  Right,
}

export enum Orientation {
  Up=0,
  Down,
  Left,
  Right,
}

export const rotateTable = {
  0: {
    0: {
      xAxis: 3,
      zAxis: 1,
      x: -1,
      y: 0,
      z: 0
    },
    1: {
      xAxis: -3,
      zAxis: -1,
      x: 0,
      y: 0,
      z: 1
    },
    2: {
      xAxis: -1,
      zAxis: 3,
      x: 0,
      y: 0,
      z: 0
    },
    3: {
      xAxis: 1,
      zAxis: -3,
      x: -1,
      y: 0,
      z: 1
    }
  },
  1: {
    0: {
      xAxis: 3,
      zAxis: -1,
      x: 0,
      y: -1,
      z: 0
    },
    1: {
      xAxis: -3,
      zAxis: 1,
      x: -1,
      y: -1,
      z: 1
    },
    2: {
      xAxis: 1,
      zAxis: 3,
      x: -1,
      y: -1,
      z: 0
    },
    3: {
      xAxis: -1,
      zAxis: -3,
      x: 0,
      y: -1,
      z: 1
    }
  },
  2: {
    0: {
      xAxis: 2,
      zAxis: 1,
      x: -1,
      y: -1,
      z: 0
    },
    1: {
      xAxis: -2,
      zAxis: -1,
      x: 0,
      y: 0,
      z: 0
    },
    2: {
      xAxis: -1,
      zAxis: 2,
      x: 0,
      y: -1,
      z: 0
    },
    3: {
      xAxis: 1,
      zAxis: -2,
      x: -1,
      y: 0,
      z: 0
    }
  },
  3: {
    0: {
      xAxis: -2,
      zAxis: 1,
      x: -1,
      y: 0,
      z: 1
    },
    1: {
      xAxis: 2,
      zAxis: -1,
      x: 0,
      y: -1,
      z: 1
    },
    2: {
      xAxis: -1,
      zAxis: -2,
      x: 0,
      y: 0,
      z: 1
    },
    3: {
      xAxis: 1,
      zAxis: 2,
      x: -1,
      y: -1,
      z: 1
    }
  },
  4: {
    0: {
      xAxis: 3,
      zAxis: -2,
      x: 0,
      y: 0,
      z: 0
    },
    1: {
      xAxis: -3,
      zAxis: 2,
      x: 0,
      y: -1,
      z: 1
    },
    2: {
      xAxis: 2,
      zAxis: 3,
      x: 0,
      y: -1,
      z: 0
    },
    3: {
      xAxis: -2,
      zAxis: -3,
      x: 0,
      y: 0,
      z: 1
    }
  },
  5: {
    0: {
      xAxis: 3,
      zAxis: 2,
      x: -1,
      y: -1,
      z: 0
    },
    1: {
      xAxis: -3,
      zAxis: -2,
      x: -1,
      y: 0,
      z: 1
    },
    2: {
      xAxis: -2,
      zAxis: 3,
      x: -1,
      y: 0,
      z: 0
    },
    3: {
      xAxis: 2,
      zAxis: -3,
      x: -1,
      y: -1,
      z: 1
    }
  }
}

export const addDirectionTable = {
  0: {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5
  },
  1: {
    0: 1,
    1: 0,
    2: 2,
    3: 3,
    4: 5,
    5: 4
  },
  2: {
    0: 2,
    1: 3,
    2: 1,
    3: 0,
    4: 5,
    5: 4
  },
  3: {
    0: 3,
    1: 2,
    2: 0,
    3: 1,
    4: 5,
    5: 4
  },
  4: {
    0: 4,
    1: 5,
    2: 2,
    3: 3,
    4: 1,
    5: 0
  },
  5: {
    0: 5,
    1: 4,
    2: 2,
    3: 3,
    4: 0,
    5: 1
  }
}

export const addOrientationTable = {
  0: {
    0: 0,
    1: 1,
    2: 2,
    3: 3
  },
  1: {
    0: 1,
    1: 0,
    2: 3,
    3: 2
  },
  2: {
    0: 2,
    1: 3,
    2: 1,
    3: 0
  },
  3: {
    0: 3,
    1: 2,
    2: 0,
    3: 1
  }
}