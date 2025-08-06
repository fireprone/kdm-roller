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

import scavengerKit from '../img/BarberSurgeon/scavenger-kit.png';
import firstAidKit from '../img/BarberSurgeon/first-aid-kit.png';

import boneAxe from '../img/BoneSmith/bone-axe.png';
import boneBlade from '../img/BoneSmith/bone-blade.png';
import boneClub from '../img/BoneSmith/bone-club.png';
import boneDagger from '../img/BoneSmith/bone-dagger.png';
import boneDarts from '../img/BoneSmith/bone-darts.png';

import singingCap from '../img/Chorosseum/singing-cap.png';
import singingBreastplate from '../img/Chorosseum/singing-breastplate.png';
import singingBoots from '../img/Chorosseum/singing-boots.png';
import singingGloves from '../img/Chorosseum/singing-gloves.png';
import singingPantaloons from '../img/Chorosseum/singing-pantaloons.png';
import spearOfLife from '../img/Chorosseum/spear-of-life.png';
import hamfluter from '../img/Chorosseum/hamfluter.png';
import pipa from '../img/Chorosseum/pipa.png';

import stoneNoses from '../img/OrganGrinder/stone-noses.png';
import luckyCharm from '../img/OrganGrinder/lucky-charm.png';
import monsterGrease from '../img/OrganGrinder/monster-grease.png';
import fecalSalve from '../img/OrganGrinder/fecal-salve.png';
import driedAcanthus from '../img/OrganGrinder/dried-acanthus.png';
import crimsonBow from '../img/Crockery/crimson-bow.png';
import crimsonSlippers from '../img/Crockery/crimson-slippers.png';
import bloodDagger from '../img/Crockery/blood-dagger.png';
import crocodileyes from '../img/Crockery/crocodileyes.png';

import leatherBoots from '../img/LeatherWorker/leather-boots.png';
import leatherMask from '../img/LeatherWorker/leather-mask.png';
import leatherShield from '../img/LeatherWorker/round-leather-shield.png';
import leatherCuirass from '../img/LeatherWorker/leather-cuirass.png';
import leatherBracers from '../img/LeatherWorker/leather-bracers.png';
import leatherSkirt from '../img/LeatherWorker/leather-skirt.png';

import counterweightedAxe from '../img/WeaponCrafter/counterweighted-axe.png';
import scrapSword from '../img/WeaponCrafter/scrap-sword.png';

import sonicTomahawk from '../img/Plumery/sonic-tomahawk.png';

import butcherCleaver from '../img/Rare/butcher-cleaver-l.png';
import royalScalpel from '../img/Rare/royal-scalpel.png';

import verminBellyboots from '../img/Outskirts/vermin-bellyboots.png';

import dreamKeeperKnife from '../img/SeedPattern/dream-keeper-knife.png';
import cruelCleaver from '../img/SeedPattern/cruel-cleaver.png';
import diamondScabKatar from '../img/SeedPattern/diamond-scab-katar.png';
import fingernailWhip from '../img/SeedPattern/fingernail-whip.png';

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
    "COUNTERWEIGHTED-AXE": {
      "Image": counterweightedAxe,
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
    "CRIMSON-BOW": {
      "Image": crimsonBow,
    },
    "CRIMSON-SLIPPERS": {
      "Image": crimsonSlippers,
    },
    "CROCODILEYES": {
      "Image": crocodileyes,
    },
    "CRUEL-CLEAVER": {
      "Image": cruelCleaver,
    },
    "DIAMOND-SCAB-KATAR": {
      "Image": diamondScabKatar,
    },
    "DREAM-KEEPER-KNIFE": {
      "Image": dreamKeeperKnife,
    },
    "DRIED-ACANTHUS": {
      "Image": driedAcanthus,
    },
    "FECAL-SALVE": {
      "Image": fecalSalve,
    },
    "FINGERNAIL-WHIP": {
      "Image": fingernailWhip,
    },
    "FIRST-AID-KIT": {
      "Image": firstAidKit,
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
    "HAMFLUTER": {
      "Image": hamfluter,
    },
    "LEATHER-BOOTS": {
      "Image": leatherBoots,
    },
    "LEATHER-BRACERS": {
      "Image": leatherBracers,
    },
    "LEATHER-CUIRASS": {
      "Image": leatherCuirass,
    },
    "LEATHER-MASK": {
      "Image": leatherMask,
    },
    "LEATHER-SHIELD": {
      "Image": leatherShield,
    },
    "LEATHER-SKIRT": {
      "Image": leatherSkirt,
    },
    "LUCKY-CHARM": {
      "Image": luckyCharm,
    },
    "MONSTER-GREASE": {
      "Image": monsterGrease,
    },
    "PIPA": {
      "Image": pipa,
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
    "ROYAL-SCALPEL": {
      "Image": royalScalpel,
    },
    "SCAVENGER-KIT": {
      "Image": scavengerKit,
    },
    "SCRAP-SWORD": {
      "Image": scrapSword,
    },
    "SINGING-CAP": {
      "Image": singingCap,
    },
    "SINGING-BOOTS": {
      "Image": singingBoots,
    },
    "SINGING-BREASTPLATE": {
      "Image": singingBreastplate,
    },
    "SINGING-GLOVES": {
      "Image": singingGloves,
    },
    "SINGING-PANTALOONS": {
      "Image": singingPantaloons,
    },
    "SONIC-TOMAHAWK": {
      "Image": sonicTomahawk,
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