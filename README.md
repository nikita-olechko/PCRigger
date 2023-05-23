# 2800-202310-DTC05
COMP 2800 Project Github - Nikita, Cam, Abdo, Brian

# PCRigger

---

## App Description

Our Team, DaWei5, is developing PCRigger, to help guide first-time builders through the process of building a PC by using AI to meet their requirements and eliminating the hassle and confusion associated with building a PC.

---

## Technologies Used

- Node.js
- JavaScript
- EJS
- MongoDB
- OpenAI gpt-3.5-turbo Api

---

## File Contents

---

## How-To's

### Setup the project requirements
1. Install VSCode
2. Install Node <https://nodejs.org/en/download>
3. Install Studio 3T <https://studio3t.com/>

### Install node modules
1. Launch the project in VSCode
2. Open the integrated terminal (Crtl + `)
3. Type "npm install" in the terminal and press enter

### Configure Environment Variables
1. If you are an approved contributor a .env file will be sent to you via Email with all the required data
2. Add your .env file to the root of the project file
3. Should issues with DB connection occur, contact Nikita Olechko at nikita.olechko@gmail.com 

### 

### Use PCRigger effectively

---

## Credits, References, Licenses

---

## How Was AI Leveraged?

### OpenAI api

OpenAI's api using gpt-3.5-turbo is used to generate PC-builds for a user's selected filtering preferences. Each part is then passed to a query to see if it exists in the respective component database. If the part is present, it will populate as normal in the configurator screen. If the part does not exist within our database, gpt-3.5 will generate an object for the specific part is then added to the component database database.

### Code and Documentation Generation

<https://chat.openai.com/> and <https://www.forefront.ai/> were leveraged to generate functions and comments which were then refined for use within PCRigger.

### Ideation and Feature Selection

<https://chat.openai.com/> was used to determine what features/attributes were important and necessary for development of PCRigger. Prompts such as:
- "When building a new computer, what aspects of a grapics card are important to consider for the following use cases: gaming, workstation, general use, home computing"
- "You are a developer creating a MongoDB database collection that will store each component (Build name, Case, CPU, GPU, Motherboard, Memory, Storage, Powersupply) of that computer. What would the MongoDB schema look like? Keep in mind that multiple memory modules or multiple storage devices can be used"

The outputs of each prompt were then refined for use within PCRigger.

---

## Contact Information
### Abdulqadir Abuharrus
Email: pandazwar@gmail.com
GitHub: <https://github.com/Abdo-Abuharrus211>

### Brian Lee
Email: brianlee1188@gmail.com 
GitHub: <https://github.com/brianctb>

### Cameron Postnikoff
Email: CameronJP@protonmail.com 
GitHub: <https://github.com/CPostnikoff>

### Nikita Olechko
Email: nikita.olechko@gmail.com 
GitHub: <https://github.com/nikita-olechko>

---
