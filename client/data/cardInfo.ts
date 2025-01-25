import foundingStoneImg from '../img/StartingGear/founding-stone.png';
import cloth from '../img/StartingGear/cloth.png';

const cardInfo = {
    "BANDAGES": {
      "Keywords": ["item"],
      "Stats": {},
      "Origin": "Skinnery",
      "Terms": [],
      "Affinities": ["LB", "DG"]
    },
    "CLOTH": {
      "Image": cloth,
      "Keywords": ["armor"],
      "Stats": {
        "Armor": 1,
        "Location": "Waist"
      },
      "Origin": "Starting Gear",
      "Terms": [],
      "Affinities": []
    },
    "FOUNDING-STONE": {
      "Image": foundingStoneImg,
      "Keywords": ["weapon", "melee", "stone"],
      "Stats": {
        "Speed": 2,
        "Accuracy": 7,
        "Strength": 1
      },
      "Origin": "Starting Gear",
      "Terms": ["Archive"],
      "Affinities": []
    },
    "RAWHIDE-BOOTS": {
      "Keywords": ["armor", "set", "rawhide"],
      "Stats": {
        "Armor": 1,
        "Location": "Legs"
      },
      "Location": "Waist",
      "Origin": "Skinnery",
      "Terms": ["Depart"],
      "Affinities": []
    },
    "RAWHIDE-DRUM": {
      "Keywords": ["item", "rawhide", "instrument", "noisy"],
      "Origin": "Skinnery",
      "Stats": {},
      "Terms": ["Arrival", "Encourage"],
      "Affinities": ["LG"]
    },
    "RAWHIDE-GLOVES": {
      "Keywords": ["armor", "set", "rawhide"],
      "Stats": {
        "Armor": 1,
        "Location": "Arms"
      },
      "Origin": "Skinnery",
      "Terms": ["Depart"],
      "Affinities": ["LR"]
    },
    "RAWHIDE-HEADBAND": {
      "Keywords": ["armor", "set", "rawhide"],
      "Stats": {
        "Armor": 1,
        "Location": "Head"
      },
      "Origin": "Skinnery",
      "Terms": [],
      "Affinities": ["DB"]
    },
    "RAWHIDE-WHIP": {
      "Keywords": ["weapon", "melee", "whip", "rawhide"],
      "Stats": {
        "Speed": 3,
        "Accuracy": 7,
        "Strength": 1
      },
      "Origin": "Skinnery",
      "Terms": ["Provoke", "Priority Target"],
      "Affinities": []
    },
    "RAWHIDE-VEST": {
      "Keywords": ["armor", "set", "rawhide"],
      "Stats": {
        "Armor": 1,
        "Location": "Chest"
      },
      "Origin": "Skinnery",
      "Terms": [],
      "Affinities": ["UB", "RR"]
    },
    "RAWHIDE-PANTS": {
      "Keywords": ["armor", "set", "rawhide"],
      "Stats": {
        "Armor": 1,
        "Location": "Waist"
      },
      "Origin": "Skinnery",
      "Terms": [],
      "Affinities": []
    }
  }

export default cardInfo;