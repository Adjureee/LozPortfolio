export type RoomId = "your_desk" | "senior_desk" | "breakroom" | "server_room" | "cto_office" | "network_closet";

export interface GameState {
  currentRoom: RoomId;
  inventory: string[];
  flags: Record<string, boolean>;
  roomItems: Record<RoomId, string[]>;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  isTakeable: boolean;
  onUse?: (state: GameState) => { message: string, newState: GameState };
}

export interface Room {
  id: RoomId;
  name: string;
  description: (state: GameState) => string;
  image: string;
  exits: Partial<Record<"north" | "south" | "east" | "west" | "enter" | "exit", RoomId | "locked">>;
  interactables: Record<string, string | ((state: GameState) => { message: string, newState?: GameState })>;
}

export const ITEMS: Record<string, Item> = {
  laptop: {
    id: "laptop",
    name: "Laptop",
    description: "Your company-issued MacBook. It's covered in dev stickers.",
    isTakeable: true,
    onUse: (state) => {
      if (!state.inventory.includes("rsa_token")) {
        return { 
          message: "You open your laptop and try to SSH into the production cluster. ACCESS DENIED. You need a physical RSA Token to authenticate the VPN.", 
          newState: state 
        };
      }
      return { 
        message: "You plug the RSA Token into your laptop and authenticate the VPN. You SSH into the production cluster...\n\nCRITICAL ERROR: Docker container 'portfolio-prod' is unresponsive. Out of Memory (OOM) kill failed. The hypervisor is completely frozen. Remote commands are failing.\n\nSYSTEM SUGGESTION: Manual hard-reboot of physical Blade 04 required in the Server Room.", 
        newState: { ...state, flags: { ...state.flags, knowsBlade: true } }
      };
    }
  },
  rsa_token: {
    id: "rsa_token",
    name: "RSA Token",
    description: "A small physical hardware token that generates 6-digit codes for VPN access.",
    isTakeable: true,
  },
  brass_key: {
    id: "brass_key",
    name: "Brass Key",
    description: "An old, heavy brass key. It looks important.",
    isTakeable: true,
  },
  badge: {
    id: "badge",
    name: "ID Badge",
    description: "An RFID access badge. It has high-level clearance for the server room.",
    isTakeable: true,
  },
  coffee: {
    id: "coffee",
    name: "Cold Brew",
    description: "A highly caffeinated cold brew.",
    isTakeable: true,
    onUse: (state) => ({
      message: "You chug the cold brew. Your heart rate spikes. You feel ready to fix any bug.",
      newState: { 
        ...state, 
        inventory: state.inventory.filter(i => i !== "coffee"),
        flags: { ...state.flags, caffeinated: true } 
      },
    }),
  }
};

export const ROOMS: Record<RoomId, Room> = {
  your_desk: {
    id: "your_desk",
    name: "Your Desk",
    description: (state) => "You are standing at your desk. Your phone is vibrating violently with PagerDuty alerts. The production servers are DOWN. The Breakroom is EAST. The Senior Developer's desk is NORTH.",
    image: "", // We removed images for pure text Zork
    exits: {
      north: "senior_desk",
      east: "breakroom"
    },
    interactables: {
      phone: "It's blowing up with Slack messages: '@here Prod is down! Error 503!'",
      desk: "It's a standing desk. Currently in the sitting position.",
    }
  },
  senior_desk: {
    id: "senior_desk",
    name: "Senior Dev's Desk",
    description: (state) => "This is your Lead Engineer's desk. It is an absolute mess of empty energy drink cans and scattered papers. The CTO's Office is WEST. Your desk is SOUTH.",
    image: "",
    exits: {
      south: "your_desk",
      west: "locked"
    },
    interactables: {
      mess: "There are papers everywhere with architecture diagrams.",
      papers: "Mostly API documentation and some doodles.",
      cans: "Empty cans of Red Bull. Classic.",
      drawers: (state) => {
        if (!state.flags.searchedDrawers) {
          return {
            message: "You rummage through the messy drawers. You found an RSA Token!",
            newState: { 
              ...state, 
              flags: { ...state.flags, searchedDrawers: true },
              roomItems: { ...state.roomItems, senior_desk: [...state.roomItems.senior_desk, "rsa_token"] }
            }
          };
        }
        return { message: "Just more empty wrappers and old hard drives.", newState: state };
      }
    }
  },
  breakroom: {
    id: "breakroom",
    name: "The Breakroom",
    description: (state) => "A sterile corporate breakroom. There is a fridge and a broken espresso machine. The heavy security door to the Server Room is NORTH. Your desk is WEST.",
    image: "",
    exits: {
      west: "your_desk",
      north: "locked" // Managed by badge
    },
    interactables: {
      fridge: "It hums quietly. There might be some drinks inside.",
      machine: (state) => {
        if (!state.flags.searchedMachine) {
          return {
            message: "You look closely at the broken espresso machine. Taped underneath the drip tray is a Brass Key!",
            newState: { 
              ...state, 
              flags: { ...state.flags, searchedMachine: true },
              roomItems: { ...state.roomItems, breakroom: [...state.roomItems.breakroom, "brass_key"] }
            }
          };
        }
        return { message: "The espresso machine displays 'ERROR: DESCALE'. You don't have time for that.", newState: state };
      },
      door: "A thick security door leading NORTH. It requires an ID badge to enter.",
      jacket: (state) => {
        if (!state.flags.searchedJacket) {
          return {
            message: "You search the pockets of a jacket draped over a chair. You found an ID Badge!",
            newState: { 
              ...state, 
              flags: { ...state.flags, searchedJacket: true },
              roomItems: { ...state.roomItems, breakroom: [...state.roomItems.breakroom, "badge"] }
            }
          };
        }
        return { message: "The pockets are empty.", newState: state };
      }
    }
  },
  server_room: {
    id: "server_room",
    name: "The Production Server Room",
    description: (state) => "You are inside the freezing server room. Rows of massive server racks line the walls. The noise of the cooling fans is deafening. The Network Closet is EAST. The exit is SOUTH.",
    image: "",
    exits: {
      south: "breakroom",
      east: "locked"
    },
    interactables: {
      racks: "Hundreds of servers blinking in unison. You need to find the specific blade causing the issue.",
      "blade 04": (state) => {
        if (!state.flags.knowsBlade) {
          return { message: "You look at Blade 04. It's unresponsive, but you aren't sure if this is the right one. You shouldn't touch it without diagnosing the issue on your laptop first.", newState: state };
        }
        if (state.flags.rebooted) {
          return { message: "Blade 04 is roaring with life. The CPU fans are spinning at 100%.", newState: state };
        }
        return { message: "You locate Blade 04. The status LEDs are completely frozen. The hypervisor is dead. There is a physical power button on the chassis.", newState: state };
      },
      "power button": (state) => {
        if (!state.flags.knowsBlade) {
          return { message: "You shouldn't press random power buttons in production!", newState: state };
        }
        if (state.flags.rebooted) {
          return { message: "The server is already running.", newState: state };
        }
        return { 
          message: "You take a deep breath, press and hold the power button on Blade 04 for 10 seconds. The server spins down, goes completely silent, and then roaringly powers back to life.\n\nYour phone buzzes. Slack message: '@here Server online! WARNING: CPU at 100%. Malicious crypto-miner detected! The network is isolated. You must physically cut the connection in the Network Closet!'", 
          newState: { ...state, flags: { ...state.flags, rebooted: true } }
        };
      },
      button: (state) => {
        if (!state.flags.knowsBlade) {
          return { message: "You shouldn't press random power buttons in production!", newState: state };
        }
        if (state.flags.rebooted) {
          return { message: "The server is already running.", newState: state };
        }
        return { 
          message: "You take a deep breath, press and hold the power button on Blade 04 for 10 seconds. The server spins down, goes completely silent, and then roaringly powers back to life.\n\nYour phone buzzes. Slack message: '@here Server online! WARNING: CPU at 100%. Malicious crypto-miner detected! The network is isolated. You must physically cut the connection in the Network Closet!'", 
          newState: { ...state, flags: { ...state.flags, rebooted: true } }
        };
      },
      keypad: (state) => {
        if (!state.flags.knowsCode) {
          return { message: "The door to the EAST is secured by a keypad. It requires a 4-digit PIN. You don't know the code.", newState: state };
        }
        return {
          message: "You punch in 0451 from the CTO's whiteboard. The heavy door to the Network Closet clicks open!",
          newState: { ...state, flags: { ...state.flags, networkUnlocked: true } }
        };
      }
    }
  },
  cto_office: {
    id: "cto_office",
    name: "The CTO's Office",
    description: (state) => "A plush corner office with mahogany furniture. There is a massive whiteboard on the wall. The exit is EAST.",
    image: "",
    exits: { east: "senior_desk" },
    interactables: {
      whiteboard: (state) => {
        return {
          message: "The whiteboard is covered in complex network diagrams. In the corner, scribbled in red marker, is: 'NETWORK CLOSET: 0451'.",
          newState: { ...state, flags: { ...state.flags, knowsCode: true } }
        };
      }
    }
  },
  network_closet: {
    id: "network_closet",
    name: "The Network Closet",
    description: (state) => "A dusty, cramped closet filled with tangled ethernet cables. On the wall is a massive red switch labeled 'FIREWALL HARD RESET'. The exit is WEST.",
    image: "",
    exits: { west: "server_room" },
    interactables: {
      switch: (state) => {
        return {
          message: "You grab the heavy red switch and pull it down with all your might. Sparks fly. The connection is severed. The crypto-miner dies. The company is saved!\n\n*** YOU TRULY WIN! ***\n(Part 2 Completed!)",
          newState: state
        };
      }
    }
  }
};

export const INITIAL_STATE: GameState = {
  currentRoom: "your_desk",
  inventory: [],
  flags: {},
  roomItems: {
    your_desk: ["laptop"],
    senior_desk: [],
    breakroom: ["coffee"],
    server_room: [],
    cto_office: [],
    network_closet: []
  }
};
