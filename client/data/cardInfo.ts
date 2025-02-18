import foundingStoneImg from '../img/StartingGear/founding-stone.png';
import cloth from '../img/StartingGear/cloth.png';

import bandages from '../img/Skinnery/bandages.png';
import rawhideBoots from '../img/Skinnery/rawhide-boots.png';
import rawhideDrum from '../img/Skinnery/rawhide-drum.png';
import rawhideHeadband from '../img/Skinnery/rawhide-headband.png';
import rawhideGloves from '../img/Skinnery/rawhide-gloves.png';
import rawhidePants from '../img/Skinnery/rawhide-pants.png';
import rawhideWhip from '../img/Skinnery/rawhide-whip.png';
import rawhideVest from '../img/Skinnery/rawhide-vest.png';

import boneAxe from '../img/BoneSmith/bone-axe.png';
import boneDagger from '../img/BoneSmith/bone-dagger.png';
import boneDarts from '../img/BoneSmith/bone-darts.png';

// import crimsonBow from '../img/Crockery/crimson-bow.png';
// import crocodileyes from '../img/Crockery/crocodileyes.png';
import bloodDagger from '../img/Crockery/blood-dagger.png';


const cardInfo = {
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
    "BANDAGES": {
      "Image": bandages,
      "Keywords": ["item"],
      "Stats": {},
      "Origin": "Skinnery",
      "Terms": [],
      "Affinities": ["LB", "DG"]
    },
    "RAWHIDE-BOOTS": {
      "Image": rawhideBoots,
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
      "Image": rawhideDrum,
      "Keywords": ["item", "rawhide", "instrument", "noisy"],
      "Origin": "Skinnery",
      "Stats": {},
      "Terms": ["Arrival", "Encourage"],
      "Affinities": ["LG"]
    },
    "RAWHIDE-GLOVES": {
      "Image": rawhideGloves,
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
      "Image": rawhideHeadband,
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
      "Image": rawhideWhip,
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
      "Image": rawhideVest,
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
      "Image": rawhidePants,
      "Keywords": ["armor", "set", "rawhide"],
      "Stats": {
        "Armor": 1,
        "Location": "Waist"
      },
      "Origin": "Skinnery",
      "Terms": [],
      "Affinities": []
    },
    "BONE-AXE": {
      "Image": boneAxe,
    },
    "BONE-DAGGER": {
      "Image": boneDagger,
    },
    "BONE-DARTS": {
      "Image": boneDarts,
    },
    "BLOOD-DAGGER": {
      "Image": bloodDagger,
    },
  }

export default cardInfo;