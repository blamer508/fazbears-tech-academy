import { useEffect, useState, useMemo, useRef, type FC } from 'react';
import { type CharacterDesign } from '@/types';

interface CutsceneProps {
  onComplete: () => void;
  night?: number;
  customDesign?: CharacterDesign | null;
  isEnding?: boolean;
  username?: string | null;
  gameVersion?: 1 | 2 | 3;
}

const Cutscene: FC<CutsceneProps> = ({ onComplete, night = 1, customDesign, isEnding, username, gameVersion = 1 }) => {
  const [text, setText] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showPortraits, setShowPortraits] = useState(false);
  const [isImpact, setIsImpact] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSlamming, setIsSlamming] = useState(false);
  const [isDrinking, setIsDrinking] = useState(false);
  const [liquidLevel, setLiquidLevel] = useState(80);
  const [isTyping, setIsTyping] = useState(false);
  const [showID, setShowID] = useState(false);
  const [showTV, setShowTV] = useState(false);
  const [policeMode, setPoliceMode] = useState(false);
  const [gameWin, setGameWin] = useState(false);
  const [doorSmashed, setDoorSmashed] = useState(false);
  const [blackout, setBlackout] = useState(false);
  const [isStabbing, setIsStabbing] = useState(false);
  const [isFireActive, setIsFireActive] = useState(false);

  const slamSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Metal_Clang.mp3'));
  const runSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Footsteps.mp3'));
  const slurpSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Slurp.mp3'));
  const blipSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Blip.mp3'));
  const doorLockSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Door_Slam.mp3'));
  const glassShatterSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Glass_Break.mp3'));
  const sirenSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Siren.mp3'));

  const dialogues = useMemo(() => {
    const displayName = username || "TECHNICIAN";
    const technicianLabel = "TECHNICIAN";

    if (gameVersion === 3) {
      const fta3Intro = [
        { speaker: "LOCATION", msg: "FAZBEAR'S FRIGHT - SAFE ROOM", side: 'center' },
        { speaker: "SPRINGTRAP", msg: "...Where... am I?", side: 'right' },
        { speaker: "SPRINGTRAP", msg: "It's been... so long. The metal... it's part of me now.", side: 'right' },
        { speaker: "SPRINGTRAP", msg: "I can feel... the movement. I'm... awake.", side: 'right' },
        { speaker: "LOCATION", msg: "SPRINGTRAP OPENS HIS EYES. THEY GLOW WITH A MALICIOUS LIGHT.", side: 'center' }
      ];

      const fta3Night2 = [
        { speaker: "LOCATION", msg: "BLAMER_508'S APARTMENT", side: 'center' },
        { speaker: displayName, msg: "Rent is due... I need a job, and fast.", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 WALKS BY AN OLD BUILDING", side: 'center' },
        { speaker: "LOCATION", msg: "FAZBEAR'S FRIGHT: THE HORROR ATTRACTION", side: 'center' },
        { speaker: displayName, msg: "Fazbear's Fright? Sounds creepy... but they're hiring a night guard.", side: 'left' },
        { speaker: "PHONE GUY", msg: "Hey! You looking for the guard job? You're hired! Start tonight!", side: 'right' },
        { speaker: displayName, msg: "That was easy... maybe too easy.", side: 'left' }
      ];

      const fta3Night3 = [
        { speaker: "LOCATION", msg: "FAZBEAR'S FRIGHT - NIGHT 3", side: 'center' },
        { speaker: displayName, msg: "This place is giving me the creeps. What was that noise?", side: 'left' },
        { speaker: "LOCATION", msg: "A PHANTOM FREDDY APPEARS IN THE WINDOW", side: 'center' },
        { speaker: displayName, msg: "AHH! What is that?! It looks like a ghost!", side: 'left' },
        { speaker: displayName, msg: "I'm starting to see things... the air is so thin in here.", side: 'left' }
      ];

      const fta3Night4 = [
        { speaker: "LOCATION", msg: "FAZBEAR'S FRIGHT - BEFORE SHIFT", side: 'center' },
        { speaker: displayName, msg: "I should check that old rabbit suit they found. It's been moving...", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 OPENS THE CHEST OF THE SUIT", side: 'center' },
        { speaker: displayName, msg: "Oh god... there's... there's a body in here!", side: 'left' },
        { speaker: displayName, msg: "Wait... this face... it looks familiar. The springlock failure... I remember now!", side: 'left' },
        { speaker: displayName, msg: "I have to get back to the office! I can't stay near this thing!", side: 'left' }
      ];

      const fta3Night5 = [
        { speaker: "LOCATION", msg: "BLAMER_508'S HOUSE - DAY OFF", side: 'center' },
        { speaker: displayName, msg: "I need a break. My head is spinning.", side: 'left' },
        { speaker: "LOCATION", msg: "ANOTHER GUARD IS COVERING THE SHIFT", side: 'center' },
        { speaker: displayName, msg: "I'll just play some games to take my mind off that place.", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 PLAYS A RETRO MATH GAME", side: 'center' }
      ];

      const fta3Night6 = [
        { speaker: "LOCATION", msg: "BLAMER_508'S HOUSE - MORNING", side: 'center' },
        { speaker: "NEWS", msg: "TRAGEDY AT FAZBEAR'S FRIGHT: NIGHT GUARD FOUND DEAD.", side: 'center' },
        { speaker: displayName, msg: "No... the other guard... he's dead.", side: 'left' },
        { speaker: displayName, msg: "I'm terrified... but I have to go back. I have to end this.", side: 'left' }
      ];

      const fta3Night7 = [
        { speaker: "LOCATION", msg: "FAZBEAR'S FRIGHT - NIGHT 7", side: 'center' },
        { speaker: displayName, msg: "I've got the gasoline. I've got the lighter.", side: 'left' },
        { speaker: displayName, msg: "Just need to wait for the right moment. I'll answer these math problems to stay focused.", side: 'left' },
        { speaker: "LOCATION", msg: "SPRINGTRAP IS LURKING IN THE VENTS", side: 'center' }
      ];

      const fta3Night7Ending = [
        { speaker: "LOCATION", msg: "FAZBEAR'S FRIGHT - 5:55 AM", side: 'center' },
        { speaker: displayName, msg: "Now's the time! Die in a fire, you monster!", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 THROWS THE GASOLINE ON SPRINGTRAP", side: 'center' },
        { speaker: "LOCATION", msg: "HE FLICKS THE LIGHTER AND THROWS IT", side: 'center' },
        { speaker: "LOCATION", msg: "BOOM! THE ENTIRE BUILDING EXPLODES IN FLAMES!", side: 'center' },
        { speaker: "SPRINGTRAP", msg: "NOOOOOOO! I ALWAYS COME BACK!", side: 'right' },
        { speaker: "LOCATION", msg: "BLAMER_508 RUNS OUT AS THE ROOF COLLAPSES", side: 'center' },
        { speaker: "LOCATION", msg: "HE SURVIVED. THE NIGHTMARE IS OVER.", side: 'center' }
      ];

      if (isEnding) {
        if (night === 7) return fta3Night7Ending;
        return [{ speaker: "LOCATION", msg: "SHIFT COMPLETE", side: 'center' }];
      }

      if (night === 2) return fta3Night2;
      if (night === 3) return fta3Night3;
      if (night === 4) return fta3Night4;
      if (night === 5) return fta3Night5;
      if (night === 6) return fta3Night6;
      if (night === 7) return fta3Night7;
      return fta3Intro;
    }

    if (gameVersion === 2) {
      const fta2Intro = [
        { speaker: "LOCATION", msg: "BLAMER_508'S RESIDENCE - 1 YEAR LATER", side: 'center' },
        { speaker: displayName, msg: "Finally, a normal life. No more purple guys, no more animatronics.", side: 'left' },
        { speaker: "LOCATION", msg: "*KNOCK* *KNOCK* *KNOCK*", side: 'center' },
        { speaker: displayName, msg: "Who's there? I'm coming!", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 OPENS THE DOOR AND BLACKS OUT", side: 'center' },
        { speaker: "LOCATION", msg: "THE OLD BASEMENT", side: 'center' },
        { speaker: displayName, msg: "Ugh... my head. Wait... this place? The old basement?!", side: 'left' },
        { speaker: displayName, msg: "The lock is back... but the questions... they're all about science now?", side: 'left' }
      ];

      const fta2Night2 = [
        { speaker: "LOCATION", msg: "THE BASEMENT - ESCAPE ATTEMPT", side: 'center' },
        { speaker: displayName, msg: "I have to get out of here while Michael is away.", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 SNEAKS OUTSIDE", side: 'center' },
        { speaker: displayName, msg: "I'm free! I'm finally out of that basement!", side: 'left' },
        { speaker: "LOCATION", msg: "MICHAEL'S FRIENDS ARE WAITING", side: 'center' },
        { speaker: "FRIEND", msg: "Where do you think you're going, technician?", side: 'right' },
        { speaker: "LOCATION", msg: "THEY BEAT UP BLAMER_508", side: 'center' },
        { speaker: "LOCATION", msg: "ANOTHER HOUSE - LOCKED ROOM", side: 'center' },
        { speaker: displayName, msg: "Waking up in another room... another house... another locked door.", side: 'left' },
        { speaker: displayName, msg: "I have to answer these science questions to survive.", side: 'left' }
      ];

      const fta2Night3 = [
        { speaker: "LOCATION", msg: "THE GREAT FIGHT BEGINS", side: 'center' },
        { speaker: displayName, msg: "I found a sword! Michael is coming with his axe!", side: 'left' },
        { speaker: "MICHAEL AFTON", msg: "You're not leaving this house alive, Blamer!", side: 'right' },
        { speaker: displayName, msg: "I'm not afraid of you, Michael! Let's end this!", side: 'left' },
        { speaker: "LOCATION", msg: "ANSWER QUESTIONS TO GAIN STRENGTH!", side: 'center' }
      ];

      const fta2Night3Ending = [
        { speaker: "LOCATION", msg: "THE GREAT FIGHT - FINALE", side: 'center' },
        { speaker: "LOCATION", msg: "MICHAEL FALLS TO THE GROUND, GASPING FOR AIR", side: 'center' },
        { speaker: displayName, msg: "It's over, Michael. Your father's sins end with you... right here, right now.", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 RAISES THE SWORD HIGH", side: 'center' },
        { speaker: "LOCATION", msg: "HE DRIVES THE BLADE DEEP INTO MICHAEL'S HEART!", side: 'center' },
        { speaker: "MICHAEL AFTON", msg: "G-GAHHH... NO... NOT... LIKE... THIS...", side: 'right' },
        { speaker: "LOCATION", msg: "BLOOD SPLATTERS ACROSS THE FLOOR AS MICHAEL GOES LIMP", side: 'center' },
        { speaker: "LOCATION", msg: "THE REIGN OF MICHAEL AFTON IS OVER.", side: 'center' }
      ];

      const fta2Night4 = [
        { speaker: "LOCATION", msg: "MICHAEL'S OFFICE", side: 'center' },
        { speaker: displayName, msg: "Michael is gone... I need to find out where William is hiding.", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 FINDS PAPERS ABOUT WILLIAM'S HIDING PLACE", side: 'center' },
        { speaker: displayName, msg: "So that's where he is... I need to go home and rest. I can't think about this right now.", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508'S RESIDENCE - SLEEPING", side: 'center' },
        { speaker: "LOCATION", msg: "DREAM: FAZBEAR'S TECH ACADEMY", side: 'center' },
        { speaker: displayName, msg: "I'm back... in the academy? Is this a dream?", side: 'left' }
      ];

      const fta2Night5 = [
        { speaker: "LOCATION", msg: "BLAMER_508'S RESIDENCE - MORNING", side: 'center' },
        { speaker: "LOCATION", msg: "BLAMER_508 LOOKS IN THE MIRROR", side: 'center' },
        { speaker: "LOCATION", msg: "ILLUSION OF WILLIAM AFTON APPEARS", side: 'center' },
        { speaker: displayName, msg: "He's still in my head... I have to go back to the pizzeria. I have to uncover the truth.", side: 'left' },
        { speaker: "LOCATION", msg: "FAZBEAR'S PIZZERIA - NIGHT 5", side: 'center' },
        { speaker: displayName, msg: "There are passwords everywhere. I need to solve these science quizzes to unlock the files.", side: 'left' }
      ];

      const fta2Night6 = [
        { speaker: "LOCATION", msg: "FAZBEAR'S PIZZERIA - UNCOVERING THE TRUTH", side: 'center' },
        { speaker: displayName, msg: "Gabriel, Susie, Jeremy, Fritz, Cassidy... the five missing children.", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 POINTS THE FLASHLIGHT AT THE ANIMATRONICS", side: 'center' },
        { speaker: displayName, msg: "Wait... what's that inside them? Oh god...", side: 'left' },
        { speaker: "LOCATION", msg: "BLAMER_508 SEES THE DEAD BODIES INSIDE", side: 'center' },
        { speaker: displayName, msg: "They're really in there. I have to stay here and watch over them. I'll volunteer as a night guard for 2 days.", side: 'left' }
      ];

      const fta2Night7 = [
        { speaker: "LOCATION", msg: "FAZBEAR'S PIZZERIA - NIGHT 7", side: 'center' },
        { speaker: displayName, msg: "He's coming. I can feel it. William is back.", side: 'left' },
        { speaker: "LOCATION", msg: "WILLIAM AFTON RETURNS", side: 'center' },
        { speaker: "WILLIAM AFTON", msg: "YOU SHOULD HAVE STAYED AWAY, TECHNICIAN!", side: 'right' },
        { speaker: displayName, msg: "I'm not afraid of you anymore! I'll keep this door locked!", side: 'left' }
      ];

      const fta2Night7Ending = [
        { speaker: "LOCATION", msg: "FAZBEAR'S TECH ACADEMY - THE FINAL CONFRONTATION", side: 'center' },
        { speaker: "WILLIAM AFTON", msg: "I'M BACK, TECHNICIAN! YOU CAN'T ESCAPE ME!", side: 'right' },
        { speaker: "LOCATION", msg: "WILLIAM GRABS A SPRING BONNIE SUIT", side: 'center' },
        { speaker: "WILLIAM AFTON", msg: "I'LL CRUSH YOU WITH MY OWN HANDS!", side: 'right' },
        { speaker: "LOCATION", msg: "WILLIAM PUNCHES THE DOOR WITH ALL HIS MIGHT", side: 'center' },
        { speaker: "LOCATION", msg: "*CRUNCH* *SNAP* *SCREAM*", side: 'center' },
        { speaker: "LOCATION", msg: "THE SPRINGLOCKS ACTIVATED... WILLIAM IS CRUSHED", side: 'center' },
        { speaker: "LOCATION", msg: "THE END", side: 'center' }
      ];

      if (isEnding) {
        if (night === 3) return fta2Night3Ending;
        if (night === 6) return fta2Night6;
        if (night === 7) return fta2Night7Ending;
        return [{ speaker: "LOCATION", msg: "SHIFT COMPLETE", side: 'center' }];
      }

      if (night === 2) return fta2Night2;
      if (night === 3) return fta2Night3;
      if (night === 4) return fta2Night4;
      if (night === 5) return fta2Night5;
      if (night === 6) return fta2Night6;
      if (night === 7) return fta2Night7;
      return fta2Intro;
    }

    if (isEnding) {
      if (night === 7) {
        return [
          { speaker: "LOCATION", msg: "BASEMENT - ESCAPING THE TRAP", side: 'center' },
          { speaker: displayName, msg: "I finally got the door open! I have to get out of here!", side: 'left' },
          { speaker: "LOCATION", msg: "OUTSIDE - HEAVY RAIN", side: 'center' },
          { speaker: "LOCATION", msg: "WILLIAM CHASES YOU TO THE EDGE OF THE CLIFF", side: 'center' },
          { speaker: displayName, msg: "There's nowhere left to go... it's too high!", side: 'left' },
          { speaker: "LOCATION", msg: "POLICE SIRENS AND FLASHING LIGHTS APPEAR", side: 'center' },
          { speaker: "POLICE", msg: "FREEZE! PUT YOUR HANDS UP!", side: 'center' },
          { speaker: "WILLIAM AFTON", msg: "IF I'M GOING DOWN, YOU'RE COMING WITH ME!", side: 'right' },
          { speaker: "LOCATION", msg: "WILLIAM GRABS YOU AND JUMPS OFF THE CLIFF", side: 'center' },
          { speaker: "LOCATION", msg: "HOSPITAL - 3 WEEKS LATER", side: 'center' },
          { speaker: displayName, msg: "...", side: 'left' },
          { speaker: displayName, msg: "I'm... I'm in a hospital?", side: 'left' },
          { speaker: "NEWS", msg: "MURDERER AND KIDNAPPER OF CHILDREN IS MISSING AFTER JUMPING OFF A CLIFF.", side: 'center' },
          { speaker: "LOCATION", msg: "TO BE CONTINUED...", side: 'center' }
        ];
      }
      if (night === 6) {
        return [
          { speaker: "LOCATION", msg: "YOUR HOUSE - NIGHT 6 ENDING", side: 'center' },
          { speaker: displayName, msg: "Finally... I'm home. I think I lost him.", side: 'left' },
          { speaker: "LOCATION", msg: "*LOUD BANGING ON THE FRONT DOOR*", side: 'center' },
          { speaker: displayName, msg: "No... no! How did he find me?!", side: 'left' },
          { speaker: "LOCATION", msg: "*THE DOOR IS SMASHED OPEN*", side: 'center' },
          { speaker: "WILLIAM AFTON", msg: "I told you... NO ONE ESCAPES.", side: 'right' },
          { speaker: "LOCATION", msg: "WILLIAM AFTON HITS YOU WITH A CROWBAR", side: 'center' },
          { speaker: "LOCATION", msg: "YOU BLACK OUT...", side: 'center' }
        ];
      }
      if (night === 5) {
        return [
          { speaker: "LOCATION", msg: "SECURITY OFFICE - NIGHT 5 ENDING", side: 'center' },
          { speaker: "PURPLE_GUY", msg: "DONE PLAYING GAMES. NOW YOU DIE.", side: 'right' },
          { speaker: "LOCATION", msg: "*CRACK* *SHATTER* *SMASH*", side: 'center' },
          { speaker: "PURPLE_GUY", msg: "I have you now... wait... what is that noise?", side: 'right' },
          { speaker: "LOCATION", msg: "POLICE SIRENS AND FLASHING LIGHTS", side: 'center' },
          { speaker: "POLICE", msg: "FREEZE! WILLIAM AFTON, YOU ARE UNDER ARREST!", side: 'center' },
          { speaker: "WILLIAM AFTON", msg: "NO! NOT LIKE THIS!", side: 'right' },
          { speaker: displayName, msg: "William Afton... so that's what W.A. stood for. I'm glad this is over.", side: 'left' },
          { speaker: "NEWS", msg: "THE SERIAL KIDNAPPER WILLIAM AFTON HAS BEEN CAPTURED AND SENTENCED TO LIFE IN PRISON.", side: 'center' }
        ];
      }
      return [
        { speaker: "LOCATION", msg: "SECURITY OFFICE - FINAL BREACH", side: 'center' },
        { speaker: "PURPLE_GUY", msg: "DONE PLAYING GAMES. NOW YOU DIE.", side: 'right' },
        { speaker: "LOCATION", msg: "*CRACK* *SHATTER* *SMASH*", side: 'center' },
        { speaker: "PURPLE_GUY", msg: "I have you now... wait... what is that noise?", side: 'right' },
        { speaker: "LOCATION", msg: "POLICE SIRENS APPROACHING", side: 'center' },
        { speaker: "WILLIAM AFTON", msg: "NO! NOT LIKE THIS!", side: 'right' },
        { speaker: "LOCATION", msg: "WILLIAM AFTON ESCAPED", side: 'center' },
        { speaker: displayName, msg: "oh, so that's what W.A. stands for, if i'd known sooner, i wouldn't do this job", side: 'left' },
        { speaker: "NEWS", msg: "the kidnapper and murderer of the children has escaped", side: 'center' }
      ];
    }
    const introDialogues = [
      { speaker: "LOCATION", msg: "FAZBEAR'S RETRO SHAKES & DINER - 11:45 PM", side: 'center' },
      { speaker: displayName, msg: "(Slurp... slurp...) Man, this chocolate shake is the only thing keeping me sane after that server crash.", side: 'left' },
      { speaker: "???", msg: `You look like a technician who knows their way around a motherboard.`, side: 'right' },
      { speaker: displayName, msg: "(!?) Who are you? I'm just here for the dairy! Don't come any closer!", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "Relax. I noticed you fixed the arcade machine in the corner with a paperclip and a piece of gum.", side: 'right' },
      { speaker: "PURPLE_GUY", msg: "We're looking for a... specialized technician for the graveyard shift. High pay. Low... social interaction.", side: 'right' },
      { speaker: displayName, msg: "Night shift? Tech maintenance? I guess my rent is overdue. When do I start?", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "Right now. Welcome to the team. Don't forget your flashlight.", side: 'right' }
    ];

    const night2Dialogues = [
      { speaker: "LOCATION", msg: "FAZBEAR'S ENTERTAINMENT OFFICE - NIGHT 2", side: 'center' },
      { speaker: displayName, msg: "Well... this is my second shift. I barely survived the first one.", side: 'left' },
      { speaker: displayName, msg: "(Adjusts flashlight) But why is that purple man acting so strange lately?", side: 'left' },
      { speaker: displayName, msg: "He keeps looking at the storage room and smiling... I better get to work before the power cuts out again.", side: 'left' }
    ];

    const night3Dialogues = [
      { speaker: "LOCATION", msg: "SERVICE CORRIDOR B - NIGHT 3", side: 'center' },
      { speaker: displayName, msg: "Is it just me, or does this place smell like... iron? And copper?", side: 'left' },
      { speaker: displayName, msg: "Wait... what is he carrying? That sack looks heavy...", side: 'left' },
      { speaker: displayName, msg: "Is that... blood? D-dripping from the bottom??", side: 'left' },
      { speaker: displayName, msg: "Hey! Boss! What's in the bag? Do you need a hand?", side: 'left' },
      { speaker: displayName, msg: "He just ignored me... I'm going to check if he's okay.", side: 'left' },
      { speaker: "LOCATION", msg: "SYSTEM ERROR: DOOR_BREACH_V3", side: 'center' },
      { speaker: "PURPLE_GUY", msg: "STAY OUT. GO BACK TO YOUR MONITOR.", side: 'right' }
    ];

    const night4Dialogues = [
      { speaker: "LOCATION", msg: "ADMINISTRATION WING - NIGHT 4", side: 'center' },
      { speaker: displayName, msg: "He's not at the desk... this is my chance to see what he's hiding.", side: 'left' },
      { speaker: displayName, msg: "(Sneaks into the office) It's so cold in here. Why is there a nameplate on the floor?", side: 'left' },
      { speaker: "LOCATION", msg: "INSPECTION: NAMEPLATE_SCAN", side: 'center' },
      { speaker: displayName, msg: "'W.A.'... That's all it says. Who is W.A.? Is that his real name?", side: 'left' },
      { speaker: "LOCATION", msg: "AUDIO DETECTED: INTERCEPTED_CALL", side: 'center' },
      { speaker: "PURPLE_GUY", msg: "(Muffled phone) ...Yes, the current technician is too curious. They're next tomorrow night. Prepare the suit.", side: 'right' },
      { speaker: displayName, msg: "(!!!) Next? Suits? I need to get out of here before he finds me!", side: 'left' },
      { speaker: "LOCATION", msg: "RUN_PROTOCOL_INITIATED", side: 'center' }
    ];

    const night5Dialogues = [
      { speaker: "LOCATION", msg: "SECURITY OFFICE - NIGHT 5 - 12:00 AM", side: 'center' },
      { speaker: displayName, msg: "HE'S RIGHT BEHIND ME! I HAVE TO REACH THE OFFICE!", side: 'left' },
      { speaker: "LOCATION", msg: "DOOR_PROTOCOL: LOCKING_INITIATED", side: 'center' },
      { speaker: "PURPLE_GUY", msg: `You can't hide in there forever, little moth.`, side: 'right' },
      { speaker: displayName, msg: "The electronic locks will hold as long as the system is processing! I just need to keep answering these hardware queries!", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "I'll break that door down before you finish your first question.", side: 'right' },
      { speaker: "LOCATION", msg: "SYSTEM STATUS: DOOR_INTEGRITY_FAILING", side: 'center' }
    ];

    const night6Dialogues = [
      { speaker: "LOCATION", msg: "1 YEAR LATER... YOUR RESIDENCE", side: 'center' },
      { speaker: displayName, msg: "(Sigh) Finally, some peace and quiet. No animatronics, no purple guys...", side: 'left' },
      { speaker: "LOCATION", msg: "TELEVISION: EMERGENCY BROADCAST", side: 'center' },
      { speaker: "NEWS", msg: "the murderer and kidnapper of children, william afton, escaped, stay safe.", side: 'center' },
      { speaker: displayName, msg: "(!!!) He escaped?! No... no, he can't be out there...", side: 'left' },
      { speaker: "LOCATION", msg: "*KNOCK* *KNOCK* *KNOCK*", side: 'center' },
      { speaker: displayName, msg: "Who's there? I'm not expecting anyone!", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "Did you miss me, technician?", side: 'right' },
      { speaker: displayName, msg: "WILLIAM?! How did you find me?! Stay back!", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "I'm tired of your little games. That door won't save you this time.", side: 'right' },
      { speaker: displayName, msg: "I still have the security override from the office! If I can just keep the system busy...", side: 'left' },
      { speaker: "LOCATION", msg: "SYSTEM_OVERRIDE: HOUSE_LOCKS_ACTIVE", side: 'center' }
    ];

    const night7Dialogues = [
      { speaker: "LOCATION", msg: "UNKNOWN FACILITY - NIGHT 7", side: 'center' },
      { speaker: displayName, msg: "Where am I? My head... it hurts...", side: 'left' },
      { speaker: displayName, msg: "There's a door ahead. It looks like the only way out.", side: 'left' },
      { speaker: "LOCATION", msg: "PUZZLE_LOCK: HARDWARE_VERIFICATION_REQUIRED", side: 'center' },
      { speaker: displayName, msg: "I have to solve this to escape. I can't let him catch me again!", side: 'left' }
    ];

    if (night === 2) return night2Dialogues;
    if (night === 3) return night3Dialogues;
    if (night === 4) return night4Dialogues;
    if (night === 5) return night5Dialogues;
    if (night === 6) return night6Dialogues;
    if (night === 7) return night7Dialogues;
    return introDialogues;
  }, [night, isEnding, username, gameVersion]);

  useEffect(() => {
    let isMounted = true;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && !isEnding) onComplete();
    };
    const updatePos = (clientX: number, clientY: number) => {
      if (isMounted) {
        setMousePos({ 
          x: (clientX / window.innerWidth - 0.5) * 40, 
          y: (clientY / window.innerHeight - 0.5) * 40 
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchMove, { passive: false });

    const timeline = async () => {
      if (!isMounted) return;
      await new Promise(r => setTimeout(r, 800));
      if (!isMounted) return;

      setIsImpact(true);
      setTimeout(() => { if (isMounted) setIsImpact(false); }, 150);
      setShowPortraits(true);
      
      for (let i = 0; i < dialogues.length; i++) {
        if (!isMounted) break;
        setDialogueIndex(i);
        setIsTyping(true);
        
        const currentMsg = dialogues[i].msg;
        const isEmotional = currentMsg.toUpperCase() === currentMsg || currentMsg.includes('!');

        if (gameVersion === 2) {
          if (!isEnding) {
            if (night === 1) {
              if (i === 4) setBlackout(true);
              if (i === 5) setBlackout(false);
            }
            if (night === 2) {
              if (i === 6) {
                setIsImpact(true);
                slamSfx.current.play().catch(() => {});
                setTimeout(() => setIsImpact(false), 500);
              }
              if (i === 7) setBlackout(true);
              if (i === 8) setBlackout(false);
            }
            if (night === 3) {
               if (i === 2) {
                 setIsImpact(true);
                 setIsSlamming(true);
                 setTimeout(() => setIsSlamming(false), 500);
               }
            }
          } else {
            if (night === 3) {
              if (i === 3) {
                setIsImpact(true);
                slamSfx.current.play().catch(() => {});
                setBlackout(true);
              }
            }
          }
        }

        if (gameVersion === 3) {
          if (isEnding) {
            if (night === 7) {
              if (i === 4) {
                setIsFireActive(true);
                setIsImpact(true);
                slamSfx.current.play().catch(() => {});
              }
            }
          }
        }

        if (isEnding) {
          if (night === 7) {
            if (i === 2) {
              setDoorSmashed(true);
              glassShatterSfx.current.play().catch(() => {});
              setIsImpact(true);
              setIsSlamming(true);
              setTimeout(() => setIsSlamming(false), 500);
              await new Promise(r => setTimeout(r, 1000));
            }
            if (i === 7) {
              setIsSlamming(true);
              setIsImpact(true);
              setTimeout(() => setIsSlamming(false), 1000);
              await new Promise(r => setTimeout(r, 1000));
            }
            if (i === 10) {
              setShowTV(true);
            }
          } else if (night === 6) {
            if (i === 2) {
              setIsSlamming(true);
              slamSfx.current.play().catch(() => {});
              setIsImpact(true);
              setTimeout(() => setIsSlamming(false), 300);
            }
            if (i === 4) {
              setDoorSmashed(true);
              slamSfx.current.play().catch(() => {});
              setIsImpact(true);
              setIsSlamming(true);
              setTimeout(() => setIsSlamming(false), 500);
              await new Promise(r => setTimeout(r, 1000));
            }
            if (i === 6) {
              setIsImpact(true);
              slamSfx.current.play().catch(() => {});
            }
            if (i === 7) {
              setBlackout(true);
            }
          } else if (night === 5) {
            // Night 5 ending logic if any specific visual cues needed
          } else if (night === 3 && gameVersion === 2) {
            if (i === 4) {
              setIsStabbing(true);
              setIsImpact(true);
              setIsSlamming(true);
              slamSfx.current.play().catch(() => {});
              setTimeout(() => { if (isMounted) setIsSlamming(false); }, 500);
            }
            if (i === 6) {
              setIsImpact(true);
              setIsSlamming(true);
              setTimeout(() => { if (isMounted) { setIsSlamming(false); setIsStabbing(false); } }, 1000);
            }
          } else {
            if (i === 2) {
              setDoorSmashed(true);
              glassShatterSfx.current.play().catch(() => {});
              setIsImpact(true);
              setIsSlamming(true);
              setTimeout(() => setIsSlamming(false), 500);
              await new Promise(r => setTimeout(r, 1000));
            }
            if (i === 4) {
              setPoliceMode(true);
              sirenSfx.current.play().catch(() => {});
            }
            if (i === 7) {
              setShowID(true);
            }
            if (i === 8) {
              setShowTV(true);
            }
          }
        }

        if (!isEnding) {
          if (night === 6) {
            if (gameVersion === 1) {
              if (i === 3) {
                setShowTV(true);
              }
            }
            if (i === 5) {
              setIsSlamming(true);
              slamSfx.current.play().catch(() => {});
              setIsImpact(true);
              setTimeout(() => { if (isMounted) setIsSlamming(false); }, 300);
              await new Promise(r => setTimeout(r, 1000));
            }
          }

          if (night === 8) {
            if (i === 5) {
              setPoliceMode(true);
              sirenSfx.current.play().catch(() => {});
            }
            if (i === 7) {
              setIsSlamming(true);
              slamSfx.current.play().catch(() => {});
              setIsImpact(true);
              setTimeout(() => { if (isMounted) setIsSlamming(false); }, 300);
              await new Promise(r => setTimeout(r, 1000));
            }
          }
        }

        if (night === 1 && i === 1) {
          setIsDrinking(true);
          setLiquidLevel(15);
          slurpSfx.current.play().catch(() => {});
          await new Promise(r => setTimeout(r, 1200));
          setIsDrinking(false);
        }

        if (night === 3 && i === 6) {
           setIsSlamming(true);
           slamSfx.current.play().catch(() => {});
           setIsImpact(true);
           setTimeout(() => { if (isMounted) setIsImpact(false); }, 300);
           await new Promise(r => setTimeout(r, 1000));
        }

        if (night === 4 && i === 8) {
           runSfx.current.play().catch(() => {});
           setIsImpact(true);
           await new Promise(r => setTimeout(r, 500));
        }

        if (night === 5 && i === 2) {
           doorLockSfx.current.play().catch(() => {});
           setIsImpact(true);
           setIsSlamming(true);
           setTimeout(() => { if (isMounted) setIsSlamming(false); }, 500);
           await new Promise(r => setTimeout(r, 800));
        }

        for (let j = 0; j <= currentMsg.length; j++) {
          if (!isMounted) break;
          setText(currentMsg.substring(0, j));
          if (j % 3 === 0 && currentMsg[j] !== ' ') {
            const clone = blipSfx.current.cloneNode() as HTMLAudioElement;
            clone.volume = 0.08;
            clone.play().catch(() => {});
          }
          await new Promise(r => setTimeout(r, isEmotional ? 20 : 35));
        }
        setIsTyping(false);
        await new Promise(r => setTimeout(r, 2500));
      }

      if (isEnding && night === 7 && isMounted) {
         setGameWin(true);
         await new Promise(r => setTimeout(r, 5000));
      }
      if (isMounted) onComplete();
    };

    timeline();

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      sirenSfx.current.pause();
    };
  }, [dialogues, onComplete, night, isEnding]);

  const currentSpeaker = dialogues[dialogueIndex]?.speaker || "SYSTEM";
  const currentSide = dialogues[dialogueIndex]?.side || "center";
  const isCurrentEmotional = dialogues[dialogueIndex]?.msg.includes('!') || dialogues[dialogueIndex]?.msg === dialogues[dialogueIndex]?.msg.toUpperCase();

  const CustomAvatar = ({ isActive, emotional }: { isActive: boolean, emotional: boolean }) => {
    if (!customDesign) return null;
    const { bodyType, primaryColor, secondaryColor, eyeType, hairColor, clothingType, hairStyle, hasGlasses } = customDesign;

    return (
      <div className={`relative w-[300px] h-[400px] flex flex-col items-center justify-end transition-all duration-500 pb-0 
        ${!isActive ? 'grayscale opacity-30 scale-90 brightness-50' : 'scale-100'} 
        ${isActive && emotional && isTyping ? 'animate-emotional-shake' : 'animate-breathing'}
        ${isActive && isDrinking ? 'rotate-[-8deg] translate-x-4 translate-y-3' : ''}`}>
        
        <div className={`relative z-20 flex flex-col items-center transition-transform duration-300 ${isActive && isDrinking ? 'rotate-[-12deg] translate-x-2 translate-y-2' : ''}`}>
          {/* Hair Styles - Short Hair Only */}
          <div 
            className={`absolute -top-[45px] w-52 h-64 z-40 transition-transform pointer-events-none ${isActive && isTyping ? 'animate-talk-bob' : ''}`}
            style={{ 
              backgroundColor: hairColor, 
              clipPath: 'polygon(10% 60%, 0% 40%, 10% 20%, 30% 5%, 50% 15%, 65% 2%, 85% 12%, 100% 7%, 100% 40%, 90% 60%)',
              border: '3px solid black'
            }}
          >
          </div>
          
          <div className={`relative w-32 h-36 bg-[#fce4d6] border-[4px] border-black rounded-xl overflow-hidden z-20 shadow-xl`}>
             <div className="absolute top-12 left-0 right-0 h-12 flex gap-4 items-center justify-center z-10">
                {/* Cool Eyes with Orange Outline (Sunglasses) */}
                <div className="relative w-12 h-5 bg-black rounded-sm overflow-hidden border-2 border-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]">
                   <div className="absolute inset-0 border-2 border-white/20"></div>
                </div>
                <div className="relative w-12 h-5 bg-black rounded-sm overflow-hidden border-2 border-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]">
                   <div className="absolute inset-0 border-2 border-white/20"></div>
                </div>
                {/* Glasses Frame Bridge */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-orange-600 z-20"></div>
             </div>
             <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-75 z-10 ${isActive && isTyping ? 'h-8' : (isActive && isDrinking ? 'h-10 bg-black/90 scale-x-75' : 'h-4')}`}>
                {/* Smile */}
                <div className="w-12 h-6 border-b-4 border-black rounded-full"></div>
             </div>
          </div>
        </div>
        
        <div className="relative flex flex-col items-center -mt-6">
           <div 
             className={`border-[4px] border-black relative z-10 overflow-hidden shadow-2xl transition-transform ${isActive && isTyping ? 'animate-talk-body' : ''} w-32 h-32 rounded-sm`}
             style={{ backgroundColor: primaryColor }}
           >
              <div className="absolute inset-0 bg-white/5 border-t border-l border-white/20"></div>
           </div>
        </div>
      </div>
    );
  };

  const SpringtrapAvatar = ({ isActive }: { isActive: boolean }) => {
    return (
      <div className={`relative w-[400px] h-[500px] flex flex-col items-center justify-end transition-all duration-500 
        ${!isActive ? 'grayscale opacity-30 scale-90 brightness-50' : 'scale-100'} 
        ${isActive && isTyping ? 'animate-emotional-shake' : 'animate-breathing'}`}>
        
        <div className="relative z-20 flex flex-col items-center">
          {/* Broken Ears */}
          <div className="absolute -top-20 left-4 w-8 h-24 bg-green-800 border-4 border-black rounded-t-full rotate-[-15deg]">
             <div className="absolute top-10 w-full h-4 bg-zinc-900"></div>
          </div>
          <div className="absolute -top-16 right-8 w-8 h-12 bg-green-800 border-4 border-black rounded-t-full rotate-[25deg]">
             <div className="absolute top-4 w-full h-8 bg-zinc-900"></div>
          </div>

          {/* Head */}
          <div className="relative w-40 h-44 bg-green-700 border-[6px] border-black rounded-3xl overflow-hidden z-20 shadow-2xl">
             <div className="absolute top-4 left-4 w-12 h-8 bg-green-900/40 rounded-full blur-sm"></div>
             <div className="absolute bottom-10 right-4 w-16 h-12 bg-zinc-900/60 rounded-full blur-md"></div>
             
             <div className="absolute top-16 left-0 right-0 flex justify-around px-6">
                <div className="w-10 h-10 bg-zinc-950 border-4 border-black rounded-full flex items-center justify-center">
                   <div className="w-4 h-4 bg-white shadow-[0_0_15px_white] rounded-full animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-zinc-950 border-4 border-black rounded-full flex items-center justify-center">
                   <div className="w-4 h-4 bg-white shadow-[0_0_15px_white] rounded-full animate-pulse"></div>
                </div>
             </div>

             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-12 bg-zinc-900 border-4 border-black rounded-xl flex flex-col justify-between p-1">
                <div className="flex justify-between h-4">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-full bg-yellow-100/80 border border-black"></div>)}
                </div>
                <div className="flex justify-between h-4">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-full bg-yellow-100/80 border border-black"></div>)}
                </div>
             </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center -mt-8">
           <div className="w-48 h-56 bg-green-800 border-[6px] border-black rounded-t-[60px] relative overflow-hidden shadow-2xl">
              <div className="absolute top-10 left-10 w-20 h-32 bg-zinc-900 border-4 border-black rounded-full">
                 <div className="absolute inset-0 flex flex-wrap gap-1 p-2">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-1 h-full ${i % 2 === 0 ? 'bg-red-600' : 'bg-blue-600'} rounded-full opacity-60`}></div>
                    ))}
                 </div>
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 bg-zinc-950 rounded-full border-2 border-black"></div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-black z-[3000] flex flex-col items-center justify-center font-['VT323'] select-none overflow-hidden transition-all duration-1000 ${isSlamming ? 'animate-slam-shake' : ''}`}>
      
      <div 
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.1)` }}
      >
        <div className="absolute inset-0 bg-[#05050a]">
            {night === 1 ? (
              <>
                <div className="absolute inset-0 diner-grid-bg opacity-30"></div>
                <div className="absolute bottom-[10%] left-0 w-64 h-[500px] bg-zinc-950 opacity-40 rounded-tr-[120px] border-r-4 border-black"></div>
                <div className="absolute bottom-[10%] right-0 w-64 h-[500px] bg-zinc-950 opacity-40 rounded-tl-[120px] border-l-4 border-black"></div>
              </>
            ) : (
              <div className="absolute inset-0 corridor-gradient opacity-40"></div>
            )}
            <div className={`absolute inset-0 transition-colors duration-200 ${policeMode ? 'animate-police-lights' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]'}`}></div>
            <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
        </div>
      </div>

        {isImpact && <div className="absolute inset-0 bg-red-900/40 z-[4000] animate-out fade-out duration-300"></div>}
        {isStabbing && (
          <div className="absolute inset-0 z-[4500] pointer-events-none flex items-center justify-center">
            <div className="absolute inset-0 bg-red-900/60 animate-pulse"></div>
            <div className="relative w-full h-full overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute bg-red-600 rounded-full animate-blood-splatter shadow-[0_0_20px_rgba(220,38,38,0.8)]"
                  style={{
                    width: Math.random() * 60 + 20 + 'px',
                    height: Math.random() * 60 + 20 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 0.3 + 's',
                    opacity: 0.9
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-red-600 text-9xl font-black italic uppercase animate-emotional-shake opacity-40 select-none">STABBED</div>
              </div>
            </div>
          </div>
        )}
        {isFireActive && (
          <div className="absolute inset-0 z-[4800] pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-orange-900/40 animate-pulse"></div>
            {[...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="absolute bottom-0 bg-orange-600 rounded-full animate-fire-particle"
                style={{
                  width: Math.random() * 100 + 50 + 'px',
                  height: Math.random() * 200 + 100 + 'px',
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 2 + 's',
                  opacity: 0.6,
                  filter: 'blur(20px)'
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-orange-600 text-9xl font-black italic uppercase animate-emotional-shake opacity-40 select-none">FIRE</div>
            </div>
          </div>
        )}
        {blackout && <div className="absolute inset-0 bg-black z-[5000] animate-in fade-in duration-1000"></div>}

      {!isEnding && (
        <div className="absolute top-8 right-12 z-50">
           <button onClick={onComplete} className="group flex flex-col items-end gap-1">
              <span className="text-zinc-500 text-sm tracking-[0.4em] uppercase group-hover:text-white transition-colors">SKIP_TRANSCRIPT [ESC]</span>
              <div className="w-24 h-0.5 bg-zinc-800 overflow-hidden">
                 <div className="h-full bg-white/40 animate-marquee-progress"></div>
              </div>
           </button>
        </div>
      )}

      <div className="relative w-full max-w-6xl h-[650px] bg-black/60 border-[20px] border-zinc-900 overflow-hidden flex items-end shadow-[0_0_150px_black]">
        
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-950 z-10 border-t-4 border-black"></div>

        {showPortraits && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-between px-20 pb-4">
            
            <div className={`transition-all duration-700 transform origin-bottom
              ${currentSide === 'left' ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0 blur-md scale-95'}
              ${night === 1 ? 'mb-10' : 'mb-6'}`}>
              <CustomAvatar isActive={currentSide === 'left'} emotional={isCurrentEmotional} />
            </div>

            <div className={`transition-all duration-1000 transform origin-bottom flex flex-col items-center justify-end mb-6
              ${currentSide === 'right' ? 'translate-x-0 opacity-100' : 'translate-x-40 opacity-0 blur-md scale-95'}`}>
               {currentSpeaker === 'SPRINGTRAP' ? (
                 <SpringtrapAvatar isActive={currentSide === 'right'} />
               ) : (
                 <div className={`relative w-[400px] h-[500px] flex flex-col items-center justify-end
                  ${currentSide === 'right' && isCurrentEmotional && isTyping ? 'animate-emotional-shake' : 'animate-breathing'}
                  ${policeMode && dialogueIndex >= 6 ? 'opacity-0 scale-50 transition-all duration-2000 blur-2xl' : ''}`}>
                    <div className={`w-48 h-64 ${currentSpeaker === 'MICHAEL AFTON' ? 'bg-zinc-800 rounded-2xl' : (currentSpeaker === 'FRIEND' ? 'bg-blue-950 rounded-lg' : 'bg-purple-950 rounded-full')} border-4 border-black relative overflow-hidden transition-transform ${isTyping && currentSide === 'right' ? 'animate-talk-bob' : ''}`}>
                       <div className={`absolute top-1/3 left-1/4 w-8 h-2 ${currentSpeaker === 'MICHAEL AFTON' ? 'bg-red-600' : 'bg-white'} shadow-[0_0_20px_white] animate-pulse`}></div>
                       <div className={`absolute top-1/3 right-1/4 w-8 h-2 ${currentSpeaker === 'MICHAEL AFTON' ? 'bg-red-600' : 'bg-white'} shadow-[0_0_20px_white] animate-pulse`}></div>
                       <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/60 rounded-full transition-all ${isTyping && currentSide === 'right' ? 'h-8 bg-black' : 'h-2'}`}></div>
                    </div>
                    <div className={`w-64 h-[250px] ${currentSpeaker === 'MICHAEL AFTON' ? 'bg-zinc-700 rounded-t-3xl' : (currentSpeaker === 'FRIEND' ? 'bg-blue-900 rounded-t-xl' : 'bg-purple-900 rounded-t-[100px]')} border-4 border-black -mt-8 transition-transform ${isTyping && currentSide === 'right' ? 'animate-talk-body' : ''}`}></div>
                 </div>
               )}
            </div>
          </div>
        )}

        {showID && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-20 animate-in zoom-in duration-500">
             <div className="w-[500px] h-[300px] bg-zinc-100 border-8 border-zinc-900 rounded-xl shadow-[0_30px_100px_black] rotate-[-2deg] p-8 flex gap-8">
                <div className="w-1/3 h-full border-4 border-zinc-900 bg-purple-950 flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="w-16 h-20 bg-purple-900 border-2 border-black rounded-full mt-4"></div>
                   <div className="w-24 h-20 bg-purple-800 border-2 border-black rounded-t-full"></div>
                </div>
                <div className="flex-1 space-y-4 pt-4 font-sans text-black">
                   <div className="border-b-4 border-zinc-900 pb-2">
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Fazbear_Entertainment</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Technician ID Badge</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-zinc-500">Subject Name:</p>
                      <p className="text-4xl font-black uppercase tracking-tighter text-purple-900 drop-shadow-sm">William Afton</p>
                      <p className="text-[10px] font-mono text-zinc-400 mt-4 leading-none">DOB: 06/18/1944 <br/> CLEARANCE: LEVEL_5_OVERRIDE</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {showTV && (
          <div className="absolute inset-0 z-[60] bg-black/95 flex items-center justify-center p-12 animate-in fade-in duration-1000">
             <div className="relative w-full max-w-4xl aspect-video bg-zinc-900 border-[20px] border-zinc-800 shadow-[0_0_100px_black] overflow-hidden rounded-[80px] crt">
                <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
                   <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-8">
                      <div className="w-32 h-10 bg-red-600 text-white font-black text-2xl flex items-center justify-center uppercase italic animate-pulse">BREAKING</div>
                      <h2 className="text-white text-6xl font-black uppercase italic tracking-tighter drop-shadow-lg leading-tight">
                         {night === 7 ? "MURDERER AND KIDNAPPER OF THE CHILDREN IS MISSING" : (night === 5 ? "THE KIDNAPPER AND MURDERER OF THE CHILDREN HAS BEEN CAPTURED" : "THE KIDNAPPER AND MURDERER OF THE CHILDREN HAS ESCAPED")}
                      </h2>
                      <p className="text-zinc-500 text-xl font-mono uppercase tracking-[0.2em]">{night === 7 ? "Search Continues After Cliff Incident" : (night === 5 ? "William Afton Sentenced to Life" : "Police Issue Emergency Warning")}</p>
                   </div>
                   <div className="h-16 bg-zinc-950 border-t-4 border-zinc-800 flex items-center px-10 overflow-hidden">
                      <div className="marquee w-full text-white text-2xl font-black uppercase tracking-widest">
                         <span>{night === 7 ? "+++ WILLIAM AFTON MISSING AFTER FALL +++ SEARCH TEAMS DEPLOYED +++ VICTIM RECOVERING IN HOSPITAL +++" : (night === 5 ? "+++ WILLIAM AFTON CAPTURED +++ JUSTICE FOR THE VICTIMS +++ SENTENCED TO LIFE IN PRISON +++" : "+++ WILLIAM AFTON ESCAPED FROM CUSTODY +++ EXTREMELY DANGEROUS +++ STAY INDOORS +++")}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {gameWin && (
           <div className="absolute inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center animate-in zoom-in duration-1000">
              <h1 className="text-9xl font-black italic text-white tracking-tighter uppercase drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">YOU WIN</h1>
              <button onClick={() => window.location.reload()} className="mt-12 px-12 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Continue</button>
           </div>
        )}

        {night === 1 && !isEnding && gameVersion === 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 z-40 flex flex-col items-center justify-end">
            <div className={`absolute bottom-24 left-1/4 translate-x-[125px] flex flex-col items-center transition-all duration-300 ${isDrinking ? 'scale-y-105 translate-y-[-5px]' : ''}`}>
               <div className={`w-1.5 h-20 bg-pink-500 border border-black origin-bottom transition-all duration-300 ${isDrinking ? 'rotate-[-38deg] h-[105px] translate-x-[-5px]' : 'rotate-[-12deg]'}`}></div>
               <div className="w-16 h-28 bg-white/20 border-2 border-white/40 clip-path-glass relative overflow-hidden backdrop-blur-md">
                  <div className="absolute bottom-0 left-0 right-0 bg-[#3d2514] transition-all duration-1000" style={{ height: `${liquidLevel}%` }}></div>
               </div>
            </div>
            <div className="relative w-[1100px] h-24">
               <div className="absolute bottom-0 w-full h-8 bg-zinc-800 border-x-4 border-b-4 border-black rounded-b-xl shadow-2xl"></div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-50"></div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] z-40"></div>
      </div>

      {!gameWin && (
        <div className="relative w-full max-w-6xl h-48 bg-black/95 border-x-[8px] border-b-[8px] border-t-2 border-zinc-800 p-6 shadow-[0_40px_100px_black] z-30 overflow-hidden animate-dialogue-entrance">
           {currentSide !== 'center' && (
             <div className={`absolute -top-4 left-12 transition-all duration-500 transform ${currentSide === 'left' ? 'bg-zinc-100 text-black' : (currentSpeaker === 'WILLIAM AFTON' || currentSide === 'right' ? 'bg-purple-900 text-white' : 'bg-red-900 text-white')} px-8 py-1 text-lg italic tracking-widest border-2 border-zinc-800 skew-x-[-15deg] font-black uppercase shadow-xl`}>
                {currentSpeaker}
             </div>
           )}
           <div className={`text-white text-2xl leading-snug pt-4 font-mono ${currentSide === 'center' ? 'text-center italic text-zinc-400' : ''}`}>
             {text}
             <span className="inline-block w-2 h-6 bg-white/20 ml-3 animate-blink align-middle"></span>
           </div>
        </div>
      )}

      <style>{`
        @keyframes police-lights {
           0%, 100% { background-color: rgba(220, 38, 38, 0.2); }
           50% { background-color: rgba(37, 99, 235, 0.2); }
        }
        .animate-police-lights { animation: police-lights 0.4s infinite; }
        .marquee { white-space: nowrap; overflow: hidden; position: relative; }
        .marquee span { display: inline-block; padding-left: 100%; animation: marquee 30s linear infinite; }
        @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
        .diner-grid-bg { background-size: 80px 80px; background-image: linear-gradient(to right, #2a2a3a 1px, transparent 1px), linear-gradient(to bottom, #2a2a3a 1px, transparent 1px); }
        .corridor-gradient { background: linear-gradient(90deg, #1a0f1a, #05050a, #1a0f1a); }
        .clip-path-glass { clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%); }
        @keyframes slam-shake { 0%, 100% { transform: translate(0,0); } 10%, 30%, 50%, 70%, 90% { transform: translate(-15px, 15px); } 20%, 40%, 60%, 80% { transform: translate(15px, -15px); } }
        .animate-slam-shake { animation: slam-shake 0.4s linear; }
        @keyframes talk-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-talk-bob { animation: talk-bob 0.15s ease-in-out infinite; }
        @keyframes talk-body { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .animate-talk-body { animation: talk-body 0.2s ease-in-out infinite; }
        @keyframes breathing { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .animate-breathing { animation: breathing 3s ease-in-out infinite; }
        @keyframes emotional-shake { 0%, 100% { transform: translate(0,0) scale(1); } 10% { transform: translate(-2px, 2px); } 20% { transform: translate(2px, -2px) scale(1.05); } 30% { transform: translate(-4px, 0px); } 40% { transform: translate(4px, 2px); } 50% { transform: scale(1.1); } }
        .animate-emotional-shake { animation: emotional-shake 0.1s linear infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 0.8s infinite; }
        @keyframes dialogue-entrance { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-dialogue-entrance { animation: dialogue-entrance 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes blood-splatter {
          0% { transform: scale(0) translate(0,0); opacity: 0; }
          50% { transform: scale(1.5) translate(var(--tw-translate-x), var(--tw-translate-y)); opacity: 1; }
          100% { transform: scale(2) translate(var(--tw-translate-x), calc(var(--tw-translate-y) + 100px)); opacity: 0; }
        }
        .animate-blood-splatter { animation: blood-splatter 1s ease-out forwards; }
        @keyframes fire-particle {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-300px) scale(1.5); opacity: 0.8; }
          100% { transform: translateY(-600px) scale(0.5); opacity: 0; }
        }
        .animate-fire-particle { animation: fire-particle 1.5s ease-in infinite; }
        @keyframes marquee-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-marquee-progress { animation: marquee-progress 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Cutscene;
