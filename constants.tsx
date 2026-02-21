
import { Question } from './types';

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
  { id: 45, question: "What is the primary benefit of 'Infinity Fabric' on AMD CPUs?", options: ["Faster RGB", "Inter-die communication", "Liquid cooling support", "Storage encryption"], correctAnswer: "Inter-die communication", explanation: "Chiplet architecture interconnect.", difficulty: "Hard", category: "CPU" }
];

export const ANIMATRONICS = [
  { name: "Freddy", videoId: "L9YhW5e5j-o", color: "bg-amber-900" },
  { name: "Bonnie", videoId: "9oD9Ym0Yf7g", color: "bg-indigo-900" },
  { name: "Chica", videoId: "SgR2hD-N_XQ", color: "bg-yellow-600" },
  { name: "Foxy", videoId: "d1K2vD12zCc", color: "bg-red-900" },
  { name: "Golden Freddy", videoId: "3mIDo25v8K8", color: "bg-yellow-400" }
];
