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
import boneBlade from '../img/BoneSmith/bone-blade.png';
import boneClub from '../img/BoneSmith/bone-club.png';
import boneDagger from '../img/BoneSmith/bone-dagger.png';
import boneDarts from '../img/BoneSmith/bone-darts.png';

import singingCap from '../img/Chorosseum/singing-cap.png';
import singingBreastplate from '../img/Chorosseum/singing-breastplate.png';
import spearOfLife from '../img/Chorosseum/spear-of-life.png';

import stoneNoses from '../img/OrganGrinder/stone-noses.png';
import luckyCharm from '../img/OrganGrinder/lucky-charm.png';
import monsterGrease from '../img/OrganGrinder/monster-grease.png';
import fecalSalve from '../img/OrganGrinder/fecal-salve.png';
// import crimsonBow from '../img/Crockery/crimson-bow.png';
// import crocodileyes from '../img/Crockery/crocodileyes.png';
import bloodDagger from '../img/Crockery/blood-dagger.png';
import crocodileyes from '../img/Crockery/crocodileyes.png';

import butcherCleaver from '../img/Rare/butcher-cleaver-l.png';

import verminBellyboots from '../img/Outskirts/vermin-bellyboots.png';

const cardInfo = {
    "BANDAGES": {
      "Image": bandages,
      "Keywords": ["item"],
      "Stats": {},
      "Origin": "Skinnery",
      "Terms": [],
      "Affinities": ["LB", "DG"]
    },
    "BLOOD-DAGGER": {
      "Image": bloodDagger,
    },
    "BONE-AXE": {
      "Image": boneAxe,
    },
    "BONE-BLADE": {
      "Image": boneBlade,
    },
    "BONE-CLUB": {
      "Image": boneClub,
    },
    "BONE-DAGGER": {
      "Image": boneDagger,
    },
    "BONE-DARTS": {
      "Image": boneDarts,
    },
    "BUTCHER-CLEAVER": {
      "Image": butcherCleaver,
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
    "CROCODILEYES": {
      "Image": crocodileyes,
    },
    "FECAL-SALVE": {
      "Image": fecalSalve,
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
    "LUCKY-CHARM": {
      "Image": luckyCharm,
    },
    "MONSTER-GREASE": {
      "Image": monsterGrease,
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
    "SINGING-CAP": {
      "Image": singingCap,
    },
    "SINGING-BREASTPLATE": {
      "Image": singingBreastplate,
    },
    "SPEAR-OF-LIFE": {
      "Image": spearOfLife,
    },
    "STONE-NOSES": {
      "Image": stoneNoses,
    },
    "VERMIN-BELLYBOOTS": {
      "IMAGE": verminBellyboots,
    }
  }

export default cardInfo;