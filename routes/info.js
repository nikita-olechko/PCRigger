const express = require('express');
router = express.Router();
const mongoose = require('mongoose');
const utils = require('../utils');

module.exports = function (app) {
    app.get('/info', async (req, res) => {
        const CPU_QAs =
            [
                {
                    "question": "What is a CPU?",
                    "answer": "The CPU, or Central Processing Unit, is the main component of a computer responsible for executing instructions and performing calculations."
                },
                {
                    "question": "Why is the CPU important in a PC?",
                    "answer": "The CPU acts as the brain of the computer, handling most computational tasks and determining the overall performance and speed of a PC."
                },
                {
                    "question": "How does the CPU affect PC performance?",
                    "answer": "The CPU's speed, number of cores, and architecture significantly impact PC performance. A faster CPU and more cores enable quicker execution of instructions and better multitasking capabilities."
                },
                {
                    "question": "Can I upgrade the CPU in my PC?",
                    "answer": "Upgrading the CPU is possible, but it depends on compatibility with the motherboard and socket type. Consult the PC manufacturer's documentation or seek professional assistance for a successful upgrade."
                },
                {
                    "question": "How can I monitor my CPU's performance?",
                    "answer": "Various software tools are available for monitoring CPU performance, providing insights into usage, temperatures, and clock speeds."
                }
            ];

        const GPU_QAs =
            [
                {
                    "question": "What is a GPU?",
                    "answer": "A GPU, or Graphics Processing Unit, is a specialized electronic circuit that accelerates the creation and rendering of images, videos, and animations on a computer."
                },
                {
                    "question": "What is the role of a GPU in a PC?",
                    "answer": "The GPU is primarily responsible for handling complex graphics computations, allowing for smooth and realistic visuals in applications such as gaming, video editing, and 3D modeling."
                },
                {
                    "question": "How does the GPU differ from the CPU?",
                    "answer": "While the CPU handles general-purpose tasks and overall system operations, the GPU focuses on parallel processing, specifically optimized for graphics-related calculations and rendering."
                },
                {
                    "question": "What factors impact GPU performance?",
                    "answer": "GPU performance is influenced by factors such as the number of cores, clock speed, memory capacity, and architecture. Higher values in these areas generally result in improved graphical performance."
                },
                {
                    "question": "Can I upgrade the GPU in my PC?",
                    "answer": "Upgrading the GPU is possible in most desktop computers, as long as the motherboard has a compatible slot and the power supply can support the new GPU's requirements. Laptops, however, often have limited upgrade options due to their integrated or non-removable GPUs."
                }
            ];

        const Memory_QAs =
            [
                {
                    "question": "What is RAM?",
                    "answer": "RAM, or Random Access Memory, is a type of computer memory that stores data that is actively being used by the CPU. It provides fast access to data, allowing for efficient multitasking and smooth program execution."
                },
                {
                    "question": "What is VRAM?",
                    "answer": "VRAM, or Video RAM, is a specialized type of memory used by the GPU for storing and quickly accessing graphics data. It is specifically designed to handle the high bandwidth requirements of rendering images, videos, and textures."
                },
                {
                    "question": "How much RAM do I need for my PC?",
                    "answer": "The amount of RAM you need for your PC depends on your specific usage requirements. For general computing tasks, 8GB to 16GB of RAM is typically sufficient. However, memory-intensive tasks like video editing or gaming may benefit from 16GB or more."
                },
                {
                    "question": "What is the difference between DDR3 and DDR4 RAM?",
                    "answer": "DDR3 and DDR4 are different generations of RAM, with DDR4 being newer and faster. DDR4 offers increased data transfer rates, higher memory capacities, and improved power efficiency compared to DDR3."
                },
                {
                    "question": "Can I mix different types or speeds of RAM?",
                    "answer": "Mixing different types or speeds of RAM is generally not recommended, as it can lead to compatibility issues and potential system instability. It's best to use matching modules to ensure optimal performance and compatibility."
                }
            ];
        
        const CPU_Cooler_QAs =
        [
            {
                "question": "What is a CPU cooler?",
                "answer": "A CPU cooler is a device designed to dissipate heat generated by the CPU during operation. It helps maintain optimal temperatures to prevent overheating and ensure the CPU's performance and longevity."
            },
            {
                "question": "What are the different types of CPU coolers?",
                "answer": "There are various types of CPU coolers, including air coolers, liquid coolers, and all-in-one (AIO) coolers. Air coolers use heat sinks and fans, while liquid coolers utilize a liquid coolant and radiator to dissipate heat more effectively."
            },
            {
                "question": "What is the difference between an air cooler and a liquid cooler?",
                "answer": "Air coolers are typically more affordable and easier to install. They rely on a combination of heat sinks and fans to cool the CPU. Liquid coolers, on the other hand, offer better cooling performance and can be quieter, but they are generally more expensive and require more complex installation."
            },
            {
                "question": "Do I need an aftermarket CPU cooler?",
                "answer": "The need for an aftermarket CPU cooler depends on factors such as the CPU's thermal requirements and your usage scenario. Stock coolers that come bundled with CPUs are usually sufficient for basic tasks, but aftermarket coolers are recommended for overclocking, high-performance systems, or if you want quieter operation."
            },
            {
                "question": "How do I choose the right CPU cooler?",
                "answer": "When choosing a CPU cooler, consider factors such as compatibility with your CPU socket, available space in your computer case, cooling performance requirements, noise level preferences, and budget. Researching reviews and comparing specifications can help you make an informed decision."
            }
        ];

        const Motherboards_QAs =
        [
            {
                "question": "What is a motherboard?",
                "answer": "A motherboard is the main circuit board of a computer system. It provides a platform for all other components to connect and interact, including the CPU, memory, storage, and expansion cards."
            },
            {
                "question": "What are the important factors to consider when choosing a motherboard?",
                "answer": "Important factors to consider when choosing a motherboard include compatibility with your CPU and other components, the motherboard form factor, available expansion slots and ports, support for memory and storage configurations, and the overall quality and reliability of the motherboard."
            },
            {
                "question": "What is the difference between ATX and microATX motherboards?",
                "answer": "ATX and microATX are two common motherboard form factors. ATX motherboards are larger and offer more expansion slots, while microATX motherboards are smaller and generally have fewer expansion slots. The choice between the two depends on your specific needs and the size of your computer case."
            },
            {
                "question": "What is the importance of chipset on a motherboard?",
                "answer": "The chipset on a motherboard is responsible for facilitating communication between the CPU, memory, storage, and other components. It affects features such as the number of USB ports, SATA ports, and the overall performance and capabilities of the motherboard."
            },
            {
                "question": "Can I upgrade my motherboard?",
                "answer": "Upgrading the motherboard is a more involved process as it often requires compatibility with other components such as the CPU and RAM. It may also involve reinstalling the operating system. It's recommended to consult the motherboard documentation and seek professional assistance if necessary."
            }
        ];

        const Storage_QAs =
        [
            {
                "question": "What is storage in a computer?",
                "answer": "Storage in a computer refers to the devices and media used to store data, including files, programs, and the operating system. It allows for long-term data retention even when the computer is powered off."
            },
            {
                "question": "What are the different types of storage devices?",
                "answer": "Different types of storage devices include hard disk drives (HDDs), solid-state drives (SSDs), and, more recently, NVMe SSDs. HDDs use magnetic platters to store data, while SSDs and NVMe SSDs use flash memory, providing faster read/write speeds and better reliability."
            },
            {
                "question": "What is the difference between HDD and SSD?",
                "answer": "HDDs store data on spinning magnetic platters and use mechanical read/write heads, while SSDs use flash memory chips for data storage. SSDs offer faster data access, lower power consumption, and better durability compared to HDDs."
            },
            {
                "question": "What is the importance of storage capacity and speed?",
                "answer": "Storage capacity determines how much data you can store, while storage speed affects how quickly data can be read from or written to the storage device. Both capacity and speed are important considerations depending on your storage needs, such as storing large files or running demanding applications."
            },
            {
                "question": "Can I use multiple storage devices in my computer?",
                "answer": "Yes, most computers support multiple storage devices. You can use a combination of HDDs and SSDs or multiple SSDs to take advantage of the benefits of different storage types, such as using an SSD for faster boot times and frequently accessed files, while using an HDD for larger file storage."
            }
        ];
        
        const Powersupplies_QAs =
        [
            {
                "question": "What is a power supply in a computer?",
                "answer": "A power supply is a component in a computer that converts the AC (alternating current) power from an electrical outlet into the DC (direct current) power required by the computer's internal components."
            },
            {
                "question": "What is the 80 PLUS certification for power supplies?",
                "answer": "The 80 PLUS certification is an efficiency rating for power supplies. It indicates the power supply's efficiency in converting AC power to DC power, with higher ratings (such as 80 PLUS Bronze, Silver, Gold, Platinum, or Titanium) representing higher efficiency levels."
            },
            {
                "question": "What factors should I consider when choosing a power supply?",
                "answer": "When choosing a power supply, consider factors such as wattage (power output), efficiency, form factor, modular or non-modular design, and the reliability and reputation of the manufacturer."
            },
            {
                "question": "What is the difference between modular and non-modular power supplies?",
                "answer": "Modular power supplies have detachable cables, allowing you to connect only the necessary cables to your components. Non-modular power supplies have fixed cables, which can result in a cleaner build but may lead to cable clutter."
            },
            {
                "question": "What is the difference between single-rail and multi-rail power supplies?",
                "answer": "Single-rail power supplies have a single high-amperage +12V rail, providing power to all components. Multi-rail power supplies divide the +12V rail into multiple lower-amperage rails, offering overcurrent protection. The choice depends on your specific requirements and the power supply's design."
            },
        ];

        const Cases_QAs =
        [
            {
                "question": "What is a PC case?",
                "answer": "A PC case, also known as a computer chassis or tower, is an enclosure that houses the components of a computer system. It provides physical protection, cooling, and organization for the internal components."
            },
            {
                "question": "What are the different form factors for PC cases?",
                "answer": "PC cases come in various form factors, such as ATX, Micro-ATX, and Mini-ITX. These form factors determine the size and compatibility of the case with different motherboard sizes."
            },
            {
                "question": "What features should I consider when choosing a PC case?",
                "answer": "When selecting a PC case, consider factors such as size, airflow and cooling options, cable management, expansion slots, drive bays, front panel connectivity, and aesthetics."
            },
            {
                "question": "What is the importance of airflow in a PC case?",
                "answer": "Proper airflow is crucial for keeping components cool and preventing overheating. A well-designed case with efficient airflow features, such as intake and exhaust fans and dust filters, can help maintain optimal temperatures for improved system performance and longevity."
            },
            {
                "question": "What are some popular PC case form factors and brands?",
                "answer": "Popular PC case form factors include mid-tower, full-tower, and compact Mini-ITX cases. Some popular case brands include Corsair, NZXT, Fractal Design, Cooler Master, and Phanteks, among others."
            }
        ];
        

        try {
            res.render('info',
            // Pass data to the view
                {
                    CPU_QAs: CPU_QAs,
                    GPU_QAs: GPU_QAs,
                    Memory_QAs: Memory_QAs,
                    CPU_Cooler_QAs: CPU_Cooler_QAs,
                    Motherboards_QAs: Motherboards_QAs,
                    Storage_QAs: Storage_QAs,
                    Powersupplies_QAs: Powersupplies_QAs,
                    Cases_QAs: Cases_QAs

                }
            );
        } catch (error) {
            res.render("errorPage");
        }
    });
};
