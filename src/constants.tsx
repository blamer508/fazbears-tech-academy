import { type Question } from '@/types';

export const QUESTIONS: Question[] = [
  // EASY: Basics
  { id: 1, question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Processing Unit", "Control Power Unit"], correctAnswer: "Central Processing Unit", explanation: "The brain of the computer.", difficulty: "Easy", category: "Basics" },
  { id: 2, question: "Which component is the 'heart' where everything plugs in?", options: ["CPU", "Power Supply", "Motherboard", "Chassis"], correctAnswer: "Motherboard", explanation: "Connects all parts.", difficulty: "Easy", category: "Basics" },
  { id: 3, question: "Which component renders 3D graphics for games?", options: ["CPU", "GPU", "NIC", "Sound Card"], correctAnswer: "GPU", explanation: "Graphics specialist.", difficulty: "Easy", category: "Graphics" },
  { id: 4, question: "Which of these is used to point and click on items?", options: ["Keyboard", "Mouse", "Monitor", "Printer"], correctAnswer: "Mouse", explanation: "Input device.", difficulty: "Easy", category: "Peripherals" },
  { id: 5, question: "What is the primary display screen called?", options: ["Mirror", "Glass", "Monitor", "Frame"], correctAnswer: "Monitor", explanation: "Visual output.", difficulty: "Easy", category: "Basics" },
  { id: 6, question: "Which device is used to type text?", options: ["Scanner", "Keyboard", "Plotter", "Modem"], correctAnswer: "Keyboard", explanation: "Typing interface.", difficulty: "Easy", category: "Peripherals" },
  { id: 7, question: "What is the main power source inside a PC?", options: ["Battery", "PSU", "Alternator", "Fuel Cell"], correctAnswer: "PSU", explanation: "Power Supply Unit.", difficulty: "Easy", category: "Power" },
  { id: 8, question: "Which part stores data long-term?", options: ["RAM", "SSD/HDD", "CPU", "Cables"], correctAnswer: "SSD/HDD", explanation: "Persistent storage.", difficulty: "Easy", category: "Storage" },
  { id: 9, question: "What do you plug into a USB port?", options: ["Gas", "Electricity", "Peripherals", "Liquid Nitrogen"], correctAnswer: "Peripherals", explanation: "Universal Serial Bus.", difficulty: "Easy", category: "Basics" },
  { id: 10, question: "Which of these outputs sound?", options: ["Microphone", "Webcam", "Speakers", "Scanner"], correctAnswer: "Speakers", explanation: "Audio output.", difficulty: "Easy", category: "Audio" },
  { id: 31, question: "Which cable is most commonly used for high-speed internet?", options: ["HDMI", "Ethernet", "VGA", "Power Cord"], correctAnswer: "Ethernet", explanation: "Network cable.", difficulty: "Easy", category: "Network" },
  { id: 32, question: "What does USB stand for?", options: ["Universal Serial Bus", "United System Board", "User Speed Bolt", "Universal System Base"], correctAnswer: "Universal Serial Bus", explanation: "Standard port type.", difficulty: "Easy", category: "Basics" },
  { id: 33, question: "Which part of the computer 'remembers' what you are doing right now?", options: ["HDD", "RAM", "Monitor", "Printer"], correctAnswer: "RAM", explanation: "Short-term memory.", difficulty: "Easy", category: "Memory" },
  { id: 34, question: "What is a 'Laptop'?", options: ["A stationary PC", "A portable computer", "A type of mouse", "A software brand"], correctAnswer: "A portable computer", explanation: "Mobility device.", difficulty: "Easy", category: "Basics" },
  { id: 35, question: "Which peripheral captures your voice?", options: ["Speaker", "Monitor", "Microphone", "Webcam"], correctAnswer: "Microphone", explanation: "Audio input.", difficulty: "Easy", category: "Audio" },

  // MEDIUM: Internal Details
  { id: 11, question: "What type of storage loses data when power is lost?", options: ["SSD", "HDD", "RAM", "Flash Drive"], correctAnswer: "RAM", explanation: "Volatile memory.", difficulty: "Medium", category: "Memory" },
  { id: 12, question: "Thermal paste is applied between which two components?", options: ["RAM and Mobo", "GPU and Monitor", "CPU and Heat Sink", "PSU and Case"], correctAnswer: "CPU and Heat Sink", explanation: "Heat transfer.", difficulty: "Medium", category: "Cooling" },
  { id: 13, question: "Which drive has no moving parts?", options: ["HDD", "Optical", "SSD", "Floppy"], correctAnswer: "SSD", explanation: "Solid State.", difficulty: "Medium", category: "Storage" },
  { id: 14, question: "What does 'SATA' refer to in storage?", options: ["Serial ATA", "System ATA", "Simple ATA", "Super ATA"], correctAnswer: "Serial ATA", explanation: "Connection standard.", difficulty: "Medium", category: "Storage" },
  { id: 15, question: "Which port is most common for modern monitors?", options: ["VGA", "HDMI/DisplayPort", "DVI", "S-Video"], correctAnswer: "HDMI/DisplayPort", explanation: "High def visual.", difficulty: "Medium", category: "I/O" },
  { id: 16, question: "What is the purpose of a Case Fan?", options: ["To look cool", "Airflow/Cooling", "To generate power", "To play music"], correctAnswer: "Airflow/Cooling", explanation: "Thermal management.", difficulty: "Medium", category: "Cooling" },
  { id: 17, question: "Which component connects the PC to a wired network?", options: ["GPU", "Sound Card", "NIC", "Capture Card"], correctAnswer: "NIC", explanation: "Network Interface Card.", difficulty: "Medium", category: "Network" },
  { id: 18, question: "What is the 'Form Factor' of a standard large motherboard?", options: ["ITX", "ATX", "Micro-ATX", "STX"], correctAnswer: "ATX", explanation: "Standard size.", difficulty: "Medium", category: "Motherboard" },
  { id: 19, question: "A 'Modular' PSU allows you to:", options: ["Remove cables", "Change colors", "Increase voltage", "Add RAM"], correctAnswer: "Remove cables", explanation: "Cable management.", difficulty: "Medium", category: "Power" },
  { id: 20, question: "Which memory is used to speed up CPU operations?", options: ["HDD", "RAM", "L3 Cache", "Flash"], correctAnswer: "L3 Cache", explanation: "On-chip memory.", difficulty: "Medium", category: "CPU" },
  { id: 36, question: "What does DDR stand for in RAM technology?", options: ["Double Data Rate", "Direct Digital Ram", "Dual Drive Rotation", "Distributed Data Relay"], correctAnswer: "Double Data Rate", explanation: "Memory standard.", difficulty: "Medium", category: "Memory" },
  { id: 37, question: "Which component is responsible for regulating voltage to the CPU?", options: ["RAM", "VRM", "HDD", "Case Fan"], correctAnswer: "VRM", explanation: "Voltage Regulator Module.", difficulty: "Medium", category: "Motherboard" },
  { id: 38, question: "What is the standard width of a desktop hard drive (HDD)?", options: ["2.5 inch", "3.5 inch", "5.25 inch", "1.8 inch"], correctAnswer: "3.5 inch", explanation: "Standard form factor.", difficulty: "Medium", category: "Storage" },
  { id: 39, question: "Which PCIe slot is typically used for a Graphics Card?", options: ["x1", "x4", "x8", "x16"], correctAnswer: "x16", explanation: "Max bandwidth slot.", difficulty: "Medium", category: "Buses" },
  { id: 40, question: "What does 'Refresh Rate' refer to in monitors?", options: ["Color accuracy", "Screen resolution", "Frames per second", "Updates per second (Hz)"], correctAnswer: "Updates per second (Hz)", explanation: "Visual smoothness.", difficulty: "Medium", category: "Display" },

  // HARD: Technical
  { id: 21, question: "What is the primary function of BIOS/UEFI?", options: ["Optimization", "File compression", "Hardware initialization", "Browsing"], correctAnswer: "Hardware initialization", explanation: "Pre-OS boot.", difficulty: "Hard", category: "Systems" },
  { id: 22, question: "Which PCIe version doubled the bandwidth of PCIe 4.0?", options: ["PCIe 3.0", "PCIe 5.0", "PCIe 6.0", "SATA 3"], correctAnswer: "PCIe 5.0", explanation: "Double speed.", difficulty: "Hard", category: "Buses" },
  { id: 23, question: "What does the 'CL' rating in RAM refer to?", options: ["Clock Limit", "Cas Latency", "Cooling Level", "Capacity"], correctAnswer: "Cas Latency", explanation: "Timing delay.", difficulty: "Hard", category: "Memory" },
  { id: 24, question: "What is the default voltage for a standard DDR4 module?", options: ["1.5V", "1.2V", "3.3V", "5V"], correctAnswer: "1.2V", explanation: "Voltage spec.", difficulty: "Hard", category: "Memory" },
  { id: 25, question: "Which RAID level provides striping without redundancy?", options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"], correctAnswer: "RAID 0", explanation: "Fast but risky.", difficulty: "Hard", category: "Storage" },
  { id: 26, question: "What is 'Overclocking'?", options: ["Setting time", "Increasing clock speed", "Changing case", "Cleaning fans"], correctAnswer: "Increasing clock speed", explanation: "Beyond stock.", difficulty: "Hard", category: "Performance" },
  { id: 27, question: "Which chipset is required for CPU overclocking on Intel?", options: ["H-Series", "B-Series", "Z-Series", "A-Series"], correctAnswer: "Z-Series", explanation: "High-end features.", difficulty: "Hard", category: "Motherboard" },
  { id: 28, question: "What is the bit-width of a standard modern desktop CPU?", options: ["16-bit", "32-bit", "64-bit", "128-bit"], correctAnswer: "64-bit", explanation: "Current architecture.", difficulty: "Hard", category: "CPU" },
  { id: 29, question: "What protocol is used by NVMe drives to talk to the CPU?", options: ["SATA", "IDE", "PCI Express", "Thunderbolt"], correctAnswer: "PCI Express", explanation: "High speed lanes.", difficulty: "Hard", category: "Storage" },
  { id: 30, question: "What is the purpose of a CMOS battery?", options: ["Start the PC", "Keep clock/BIOS settings", "Charge RAM", "Internal light"], correctAnswer: "Keep clock/BIOS settings", explanation: "Persistent settings.", difficulty: "Hard", category: "Motherboard" },
  { id: 41, question: "What is 'ECC' in RAM terms?", options: ["Enhanced Clock Control", "Error Correction Code", "Extra Capacity Cache", "Effective Cycle Count"], correctAnswer: "Error Correction Code", explanation: "Server-grade reliability.", difficulty: "Hard", category: "Memory" },
  { id: 42, question: "In CPU design, what is a 'Die'?", options: ["A cooling fan", "The physical semiconductor silicon", "A type of socket", "A failure state"], correctAnswer: "The physical semiconductor silicon", explanation: "Internal chip structure.", difficulty: "Hard", category: "CPU" },
  { id: 43, question: "What does TDP stand for?", options: ["Total Data Power", "Thermal Design Power", "Temperature Drive Port", "Time Delay Protocol"], correctAnswer: "Thermal Design Power", explanation: "Heat dissipation spec.", difficulty: "Hard", category: "Cooling" },
  { id: 44, question: "Which technology allows multiple GPU cores to work on a single frame?", options: ["Hyperthreading", "Ray Tracing", "Parallel Processing", "Crossfire/SLI"], correctAnswer: "Parallel Processing", explanation: "Compute architecture.", difficulty: "Hard", category: "Graphics" },
  { id: 45, question: "What is the primary benefit of 'Infinity Fabric' on AMD CPUs?", options: ["Faster RGB", "Inter-die communication", "Liquid cooling support", "Storage encryption"], correctAnswer: "Inter-die communication", explanation: "Chiplet architecture interconnect.", difficulty: "Hard", category: "CPU" },
  
  // NEW QUESTIONS: Coding & General Computing
  { id: 46, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Tool Multi Language", "Home Tool Markup Language"], correctAnswer: "Hyper Text Markup Language", explanation: "Web structure.", difficulty: "Easy", category: "Coding" },
  { id: 47, question: "Which of these is a popular programming language?", options: ["Python", "Cobra", "Viper", "Anaconda"], correctAnswer: "Python", explanation: "General purpose language.", difficulty: "Easy", category: "Coding" },
  { id: 48, question: "What is a 'Bug' in computer science?", options: ["An insect", "A hardware part", "An error in code", "A type of virus"], correctAnswer: "An error in code", explanation: "Software defect.", difficulty: "Easy", category: "Coding" },
  { id: 49, question: "Which symbol is used for comments in many languages like JS?", options: ["//", "##", "??", "!!"], correctAnswer: "//", explanation: "Code annotation.", difficulty: "Easy", category: "Coding" },
  { id: 50, question: "What is the 'Cloud'?", options: ["A weather pattern", "Remote servers on the internet", "A type of CPU", "A local hard drive"], correctAnswer: "Remote servers on the internet", explanation: "Online storage/compute.", difficulty: "Easy", category: "General" },
  
  { id: 51, question: "What is a 'Variable' in programming?", options: ["A constant value", "A container for data", "A type of monitor", "A network cable"], correctAnswer: "A container for data", explanation: "Data storage in code.", difficulty: "Medium", category: "Coding" },
  { id: 52, question: "Which of these is used for styling web pages?", options: ["HTML", "CSS", "SQL", "JSON"], correctAnswer: "CSS", explanation: "Cascading Style Sheets.", difficulty: "Medium", category: "Coding" },
  { id: 53, question: "What does 'Open Source' mean?", options: ["Free to use only", "Code is publicly available", "Source is hidden", "Only for experts"], correctAnswer: "Code is publicly available", explanation: "Collaborative software.", difficulty: "Medium", category: "General" },
  { id: 54, question: "What is an 'Algorithm'?", options: ["A type of math", "A set of step-by-step instructions", "A computer brand", "A music file"], correctAnswer: "A set of step-by-step instructions", explanation: "Problem solving logic.", difficulty: "Medium", category: "Coding" },
  { id: 55, question: "What does 'URL' stand for?", options: ["Uniform Resource Locator", "Universal Radio Link", "User Remote Line", "United Resource List"], correctAnswer: "Uniform Resource Locator", explanation: "Web address.", difficulty: "Medium", category: "General" },

  { id: 56, question: "What is 'Recursion' in programming?", options: ["A loop that never ends", "A function that calls itself", "A type of database", "Memory leak"], correctAnswer: "A function that calls itself", explanation: "Self-referential logic.", difficulty: "Hard", category: "Coding" },
  { id: 57, question: "Which data structure uses LIFO (Last-In, First-Out)?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: "Stack", explanation: "Ordered collection.", difficulty: "Hard", category: "Coding" },
  { id: 58, question: "What is the purpose of 'Git'?", options: ["To browse the web", "Version control", "To compile code", "To design graphics"], correctAnswer: "Version control", explanation: "Code management.", difficulty: "Hard", category: "Coding" },
  { id: 59, question: "What is 'Asynchronous' programming?", options: ["Code that runs in order", "Code that runs independently of main flow", "Code that is very fast", "Code that is encrypted"], correctAnswer: "Code that runs independently of main flow", explanation: "Non-blocking execution.", difficulty: "Hard", category: "Coding" },
  { id: 60, question: "What does 'API' stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Index", "Applied Power Interface"], correctAnswer: "Application Programming Interface", explanation: "Software communication.", difficulty: "Hard", category: "Coding" }
];

export const SCIENCE_QUESTIONS: Question[] = [
  // EASY
  { id: 101, question: "What is the chemical symbol for water?", options: ["O2", "H2O", "CO2", "HO"], correctAnswer: "H2O", explanation: "Two hydrogen atoms and one oxygen atom.", difficulty: "Easy", category: "Chemistry" },
  { id: 102, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: "Mars", explanation: "Iron oxide on its surface gives it a reddish appearance.", difficulty: "Easy", category: "Astronomy" },
  { id: 103, question: "What is the center of an atom called?", options: ["Electron", "Proton", "Nucleus", "Neutron"], correctAnswer: "Nucleus", explanation: "The core containing protons and neutrons.", difficulty: "Easy", category: "Physics" },
  { id: 104, question: "How many bones are in the adult human body?", options: ["206", "150", "300", "250"], correctAnswer: "206", explanation: "Adults have 206 bones.", difficulty: "Easy", category: "Biology" },
  { id: 105, question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: "Carbon Dioxide", explanation: "Used in photosynthesis.", difficulty: "Easy", category: "Biology" },
  { id: 106, question: "What is the boiling point of water at sea level?", options: ["90°C", "100°C", "110°C", "120°C"], correctAnswer: "100°C", explanation: "Standard boiling point.", difficulty: "Easy", category: "Physics" },
  { id: 107, question: "Which force pulls objects toward the center of the Earth?", options: ["Magnetism", "Friction", "Gravity", "Inertia"], correctAnswer: "Gravity", explanation: "Universal attraction.", difficulty: "Easy", category: "Physics" },
  
  // MEDIUM
  { id: 111, question: "What is the most abundant gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correctAnswer: "Nitrogen", explanation: "Nitrogen makes up about 78% of the atmosphere.", difficulty: "Medium", category: "Earth Science" },
  { id: 112, question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Vacuole"], correctAnswer: "Mitochondria", explanation: "Produces energy (ATP).", difficulty: "Medium", category: "Biology" },
  { id: 113, question: "What is the speed of light in a vacuum?", options: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correctAnswer: "300,000 km/s", explanation: "Approximately 299,792,458 m/s.", difficulty: "Medium", category: "Physics" },
  { id: 114, question: "Which element has the atomic number 1?", options: ["Helium", "Oxygen", "Hydrogen", "Carbon"], correctAnswer: "Hydrogen", explanation: "The simplest and most abundant element.", difficulty: "Medium", category: "Chemistry" },
  { id: 115, question: "What type of rock is formed from cooled magma?", options: ["Sedimentary", "Metamorphic", "Igneous", "Basalt"], correctAnswer: "Igneous", explanation: "Formed through the cooling and solidification of magma or lava.", difficulty: "Medium", category: "Geology" },
  { id: 116, question: "What is the pH of pure water?", options: ["5", "6", "7", "8"], correctAnswer: "7", explanation: "Neutral pH.", difficulty: "Medium", category: "Chemistry" },
  { id: 117, question: "Which planet has the most rings?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correctAnswer: "Saturn", explanation: "Famous ring system.", difficulty: "Medium", category: "Astronomy" },

  // HARD
  { id: 121, question: "What is the half-life of Carbon-14?", options: ["5,730 years", "1,200 years", "10,000 years", "2,500 years"], correctAnswer: "5,730 years", explanation: "Used in radiocarbon dating.", difficulty: "Hard", category: "Physics" },
  { id: 122, question: "What is the only metal that is liquid at room temperature?", options: ["Gallium", "Mercury", "Cesium", "Bromine"], correctAnswer: "Mercury", explanation: "Atomic symbol Hg.", difficulty: "Hard", category: "Chemistry" },
  { id: 123, question: "Which law states that for every action, there is an equal and opposite reaction?", options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Kepler's Law"], correctAnswer: "Newton's Third Law", explanation: "Fundamental principle of mechanics.", difficulty: "Hard", category: "Physics" },
  { id: 124, question: "What is the largest organ in the human body?", options: ["Liver", "Brain", "Skin", "Heart"], correctAnswer: "Skin", explanation: "Covers the entire body.", difficulty: "Hard", category: "Biology" },
  { id: 125, question: "What is the process by which a solid changes directly into a gas?", options: ["Evaporation", "Condensation", "Sublimation", "Deposition"], correctAnswer: "Sublimation", explanation: "e.g., Dry ice.", difficulty: "Hard", category: "Chemistry" },
  { id: 126, question: "What is the most common element in the universe?", options: ["Helium", "Oxygen", "Hydrogen", "Nitrogen"], correctAnswer: "Hydrogen", explanation: "75% of baryonic mass.", difficulty: "Hard", category: "Astronomy" },
  { id: 127, question: "What is the name of the first artificial satellite?", options: ["Vanguard", "Explorer 1", "Sputnik 1", "Telstar"], correctAnswer: "Sputnik 1", explanation: "Launched by USSR in 1957.", difficulty: "Hard", category: "Astronomy" },
  { id: 128, question: "What is the primary function of the enzyme DNA polymerase?", options: ["Unzip DNA", "Synthesize DNA", "Repair DNA", "Degrade DNA"], correctAnswer: "Synthesize DNA", explanation: "It adds nucleotides to a DNA strand.", difficulty: "Hard", category: "Biology" },
  { id: 129, question: "Which particle is responsible for the strong nuclear force?", options: ["Photon", "Gluon", "W Boson", "Graviton"], correctAnswer: "Gluon", explanation: "Gluons 'glue' quarks together.", difficulty: "Hard", category: "Physics" },
  { id: 130, question: "What is the molar mass of Carbon Dioxide (CO2)?", options: ["28 g/mol", "32 g/mol", "44 g/mol", "56 g/mol"], correctAnswer: "44 g/mol", explanation: "C(12) + O2(16*2) = 44.", difficulty: "Hard", category: "Chemistry" },
  { id: 131, question: "What is the term for the movement of water across a semi-permeable membrane?", options: ["Diffusion", "Osmosis", "Active Transport", "Facilitated Diffusion"], correctAnswer: "Osmosis", explanation: "Specific to water movement.", difficulty: "Medium", category: "Biology" },
  { id: 132, question: "Which layer of the Earth is liquid?", options: ["Crust", "Mantle", "Outer Core", "Inner Core"], correctAnswer: "Outer Core", explanation: "Composed of liquid iron and nickel.", difficulty: "Medium", category: "Geology" },
  { id: 133, question: "What is the first law of thermodynamics?", options: ["Entropy increases", "Energy is conserved", "Absolute zero is unreachable", "Action equals reaction"], correctAnswer: "Energy is conserved", explanation: "Energy cannot be created or destroyed.", difficulty: "Hard", category: "Physics" },
  { id: 134, question: "Which functional group is characteristic of alcohols?", options: ["-COOH", "-CHO", "-OH", "-NH2"], correctAnswer: "-OH", explanation: "Hydroxyl group.", difficulty: "Hard", category: "Chemistry" },
  { id: 135, question: "What is the genotype of a homozygous recessive individual?", options: ["AA", "Aa", "aa", "Ab"], correctAnswer: "aa", explanation: "Two copies of the recessive allele.", difficulty: "Medium", category: "Biology" },
  { id: 136, question: "Who proposed the uncertainty principle?", options: ["Einstein", "Bohr", "Heisenberg", "Schrödinger"], correctAnswer: "Heisenberg", explanation: "Position and momentum cannot both be known exactly.", difficulty: "Hard", category: "Physics" },
  { id: 137, question: "What is the most common isotope of Hydrogen?", options: ["Protium", "Deuterium", "Tritium", "Quadium"], correctAnswer: "Protium", explanation: "Consists of one proton and no neutrons.", difficulty: "Hard", category: "Chemistry" },
  { id: 138, question: "Which organelle is responsible for protein synthesis?", options: ["Golgi Apparatus", "Ribosome", "Lysosome", "Endoplasmic Reticulum"], correctAnswer: "Ribosome", explanation: "Translates mRNA into protein.", difficulty: "Medium", category: "Biology" },
  { id: 139, question: "What is the escape velocity of Earth?", options: ["7.9 km/s", "11.2 km/s", "25.4 km/s", "40.2 km/s"], correctAnswer: "11.2 km/s", explanation: "Speed needed to break Earth's gravity.", difficulty: "Hard", category: "Physics" },
  { id: 140, question: "What is the functional unit of the kidney?", options: ["Neuron", "Nephron", "Alveoli", "Villi"], correctAnswer: "Nephron", explanation: "Filters blood and produces urine.", difficulty: "Hard", category: "Biology" },
  { id: 141, question: "Which element has the highest electronegativity?", options: ["Oxygen", "Chlorine", "Fluorine", "Neon"], correctAnswer: "Fluorine", explanation: "Fluorine is the most electronegative element.", difficulty: "Hard", category: "Chemistry" },
  { id: 142, question: "What is the term for a star that has collapsed into a point of infinite density?", options: ["White Dwarf", "Neutron Star", "Black Hole", "Red Giant"], correctAnswer: "Black Hole", explanation: "A singularity.", difficulty: "Medium", category: "Astronomy" },
  { id: 143, question: "Which law states that pressure and volume are inversely proportional?", options: ["Charles's Law", "Boyle's Law", "Avogadro's Law", "Gay-Lussac's Law"], correctAnswer: "Boyle's Law", explanation: "P1V1 = P2V2.", difficulty: "Hard", category: "Physics" },
  { id: 144, question: "What is the process of converting light energy into chemical energy?", options: ["Respiration", "Fermentation", "Photosynthesis", "Glycolysis"], correctAnswer: "Photosynthesis", explanation: "Occurs in chloroplasts.", difficulty: "Easy", category: "Biology" },
  { id: 145, question: "What is the most abundant element in the Earth's crust?", options: ["Silicon", "Iron", "Oxygen", "Aluminum"], correctAnswer: "Oxygen", explanation: "Oxygen makes up about 46% of the crust.", difficulty: "Hard", category: "Geology" },
  { id: 146, question: "What is the name of the process where DNA is copied into mRNA?", options: ["Translation", "Transcription", "Replication", "Mutation"], correctAnswer: "Transcription", explanation: "Occurs in the nucleus.", difficulty: "Hard", category: "Biology" },
  { id: 147, question: "Which subatomic particle has no electric charge?", options: ["Proton", "Electron", "Neutron", "Positron"], correctAnswer: "Neutron", explanation: "Found in the nucleus.", difficulty: "Easy", category: "Physics" },
  { id: 148, question: "What is the unit of electrical resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], correctAnswer: "Ohm", explanation: "Measured using an ohmmeter.", difficulty: "Medium", category: "Physics" },
  { id: 149, question: "What is the chemical formula for table salt?", options: ["NaCl", "KCl", "MgCl2", "CaCl2"], correctAnswer: "NaCl", explanation: "Sodium Chloride.", difficulty: "Easy", category: "Chemistry" },
  { id: 150, question: "Which planet is known for its prominent hexagonal storm at its north pole?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], correctAnswer: "Saturn", explanation: "The Saturn Hexagon.", difficulty: "Hard", category: "Astronomy" }
];

export const MATH_QUESTIONS: Question[] = [
  // EASY
  { id: 201, question: "What is 15 + 27?", options: ["32", "42", "52", "44"], correctAnswer: "42", explanation: "Basic addition.", difficulty: "Easy", category: "Arithmetic" },
  { id: 202, question: "What is 100 - 37?", options: ["63", "53", "73", "67"], correctAnswer: "63", explanation: "Basic subtraction.", difficulty: "Easy", category: "Arithmetic" },
  { id: 203, question: "What is 8 x 7?", options: ["54", "56", "64", "48"], correctAnswer: "56", explanation: "Multiplication table.", difficulty: "Easy", category: "Arithmetic" },
  { id: 204, question: "What is 81 ÷ 9?", options: ["7", "8", "9", "10"], correctAnswer: "9", explanation: "Basic division.", difficulty: "Easy", category: "Arithmetic" },
  { id: 205, question: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], correctAnswer: "6", explanation: "Hexa- means six.", difficulty: "Easy", category: "Geometry" },
  { id: 206, question: "What is the square root of 64?", options: ["6", "7", "8", "9"], correctAnswer: "8", explanation: "8 * 8 = 64.", difficulty: "Easy", category: "Arithmetic" },
  { id: 207, question: "What is 1/2 + 1/4?", options: ["1/6", "2/4", "3/4", "1/4"], correctAnswer: "3/4", explanation: "0.5 + 0.25 = 0.75.", difficulty: "Easy", category: "Fractions" },

  // MEDIUM
  { id: 211, question: "What is the value of x if 2x + 5 = 15?", options: ["5", "10", "7.5", "20"], correctAnswer: "5", explanation: "2x = 10, so x = 5.", difficulty: "Medium", category: "Algebra" },
  { id: 212, question: "What is the area of a rectangle with length 8 and width 5?", options: ["13", "40", "26", "35"], correctAnswer: "40", explanation: "Length x Width.", difficulty: "Medium", category: "Geometry" },
  { id: 213, question: "What is 12 squared?", options: ["122", "144", "164", "124"], correctAnswer: "144", explanation: "12 * 12 = 144.", difficulty: "Medium", category: "Arithmetic" },
  { id: 214, question: "What is 15% of 200?", options: ["20", "30", "40", "15"], correctAnswer: "30", explanation: "0.15 * 200 = 30.", difficulty: "Medium", category: "Percentages" },
  { id: 215, question: "In a right triangle, if sides are 3 and 4, what is the hypotenuse?", options: ["5", "6", "7", "25"], correctAnswer: "5", explanation: "Pythagorean theorem: 3^2 + 4^2 = 5^2.", difficulty: "Medium", category: "Geometry" },
  { id: 216, question: "What is the next prime number after 7?", options: ["9", "10", "11", "13"], correctAnswer: "11", explanation: "Primes: 2, 3, 5, 7, 11...", difficulty: "Medium", category: "Number Theory" },
  { id: 217, question: "What is the perimeter of a circle called?", options: ["Area", "Diameter", "Radius", "Circumference"], correctAnswer: "Circumference", explanation: "The distance around a circle.", difficulty: "Medium", category: "Geometry" },

  // HARD
  { id: 221, question: "What is the value of Pi to two decimal places?", options: ["3.12", "3.14", "3.16", "3.18"], correctAnswer: "3.14", explanation: "Common approximation of Pi.", difficulty: "Hard", category: "Geometry" },
  { id: 222, question: "Solve for x: x^2 - 9 = 0", options: ["3", "-3", "Both 3 and -3", "9"], correctAnswer: "Both 3 and -3", explanation: "x^2 = 9, so x = ±3.", difficulty: "Hard", category: "Algebra" },
  { id: 223, question: "What is the sum of the interior angles of a triangle?", options: ["90°", "180°", "270°", "360°"], correctAnswer: "180°", explanation: "Fundamental geometry property.", difficulty: "Hard", category: "Geometry" },
  { id: 224, question: "What is 2 to the power of 10?", options: ["512", "1024", "2048", "1000"], correctAnswer: "1024", explanation: "Binary kilo.", difficulty: "Hard", category: "Arithmetic" },
  { id: 225, question: "What is the derivative of x^2?", options: ["x", "2", "2x", "x^3"], correctAnswer: "2x", explanation: "Power rule in calculus.", difficulty: "Hard", category: "Calculus" },
  { id: 226, question: "What is the log base 10 of 1000?", options: ["2", "3", "4", "10"], correctAnswer: "3", explanation: "10^3 = 1000.", difficulty: "Hard", category: "Algebra" },
  { id: 227, question: "What is the probability of rolling a 7 with two six-sided dice?", options: ["1/6", "1/12", "1/36", "1/7"], correctAnswer: "1/6", explanation: "6 combinations out of 36.", difficulty: "Hard", category: "Probability" },
  { id: 228, question: "What is the volume of a sphere with radius r?", options: ["πr^2", "2πr", "4/3πr^3", "4πr^2"], correctAnswer: "4/3πr^3", explanation: "Volume formula.", difficulty: "Hard", category: "Geometry" },
  { id: 229, question: "What is the value of 5 factorial (5!)?", options: ["25", "60", "120", "100"], correctAnswer: "120", explanation: "5 * 4 * 3 * 2 * 1 = 120.", difficulty: "Hard", category: "Arithmetic" },
  { id: 230, question: "What is the slope of the line y = 3x + 7?", options: ["3", "7", "-3", "1/3"], correctAnswer: "3", explanation: "m in y = mx + b.", difficulty: "Hard", category: "Algebra" },
  { id: 231, question: "What is the cosine of 0 degrees?", options: ["0", "1", "-1", "0.5"], correctAnswer: "1", explanation: "Trigonometric value.", difficulty: "Hard", category: "Trigonometry" },
  { id: 232, question: "What is the name of a polygon with 10 sides?", options: ["Octagon", "Nonagon", "Decagon", "Dodecagon"], correctAnswer: "Decagon", explanation: "Deca- means ten.", difficulty: "Hard", category: "Geometry" },
  { id: 233, question: "In statistics, what is the middle value of a data set called?", options: ["Mean", "Median", "Mode", "Range"], correctAnswer: "Median", explanation: "Central tendency measure.", difficulty: "Hard", category: "Statistics" },
  { id: 234, question: "What is the quadratic formula used for?", options: ["Finding area", "Solving triangles", "Finding roots of quadratic equations", "Calculating interest"], correctAnswer: "Finding roots of quadratic equations", explanation: "x = (-b ± √(b² - 4ac)) / 2a.", difficulty: "Hard", category: "Algebra" },
  { id: 235, question: "What is the value of e (Euler's number) approximately?", options: ["2.17", "2.71", "3.14", "1.61"], correctAnswer: "2.71", explanation: "Base of natural logarithms.", difficulty: "Hard", category: "Calculus" }
];

export const ANIMATRONICS = [
  { name: "Freddy", videoId: "L9YhW5e5j-o", color: "bg-amber-900" },
  { name: "Bonnie", videoId: "9oD9Ym0Yf7g", color: "bg-indigo-900" },
  { name: "Chica", videoId: "SgR2hD-N_XQ", color: "bg-yellow-600" },
  { name: "Foxy", videoId: "d1K2vD12zCc", color: "bg-red-900" },
  { name: "Golden Freddy", videoId: "3mIDo25v8K8", color: "bg-yellow-400" }
];
