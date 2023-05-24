# 2800-202310-DTC05
COMP 2800 Project Github - Nikita, Cam, Abdo, Brian

# PCRigger

---

## App Description

Our Team, DaWei5, is developing PCRigger, to help guide first-time builders through the process of building a PC by using AI to meet their requirements and eliminating the hassle and confusion associated with building a PC.

---

## Technologies Used

- JavaScript
- Node.js
- Express.js
- MongoDB
- OpenAI gpt-3.5-turbo Api

---

## File Contents
<pre>
│   .env
│   .gitignore
│   databaseConnection.js
│   index.js
│   package-lock.json
│   package.json
│   README.md
│   utils.js
│
├───.vscode
│       settings.json
│
├───extras
│   └───database_data
│           cpuBenchmarkData.csv
│           csvConversion.js
│           gpuBenchmarkData.csv
│           gpuSpecData.csv
│           memorySpecData.csv
│           storageSpecData.csv
│
├───models
│       buildsModel.js
│       caseModel.js
│       cpuCoolerModel.js
│       cpuModel.js
│       gpuModel.js
│       memoryModel.js
│       motherboardsModel.js
│       storageModel.js
│
├───public
│   ├───icons
│   │       back.png
│   │       delete-trashcan.png
│   │       editButton.png
│   │       home.png
│   │       options.png
│   │       pencil.png
│   │       user_profile.png
│   │
│   ├───images
│   │       favicon.png
│   │       knuckles.png
│   │       logo.png
│   │       logo_transparent.png
│   │
│   └───styles
│           info.css
│           landing_page.css
│           members.css
│           menu_buttons.css
│           notification_page.css
│           styles.css
│
├───routes
│       404.js
│       admin.js
│       configurator.js
│       email_confirm.js
│       generateNewBuild.js
│       info.js
│       instructions.md
│       landing_page.js
│       login.js
│       members.js
│       OpenAIcall.js
│       partsCategoryPage.js
│       partsComparison.js
│       partsListPage.js
│       prebuiltOptions.js
│       profile.js
│       sampleRoute.js
│       searchPartFunction.js
│       signOut.js
│       signUp.js
│       specificBuildInfo.js
│       specsPage.js
│
└───views
│   404.ejs
│   500.ejs
│   admin.ejs
│   AI_build.ejs
│   buildList.ejs
│   comparisonPage.ejs
│   configurator.ejs
│   email_confirm.ejs
│   errorPage.ejs
│   filteredPartsListPage.ejs
│   index.ejs
│   info.ejs
│   landing_page.ejs
│   login.ejs
│   members.ejs
│   notAuthorized.ejs
│   partsCategoryPage.ejs
│   partsListPage.ejs
│   password_edit.ejs
│   password_reset.ejs
│   prebuiltOptions.ejs
│   profile.ejs
│   profile_edit.ejs
│   recovery_questions.ejs
│   sign up.ejs
│   specificBuildInfo.ejs
│   specsPage.ejs
│   username_edit.ejs
│
├───partials
│   │   advancedFilterComponents.ejs
│   │   caseCard.ejs
│   │   configuratorEntries.ejs
│   │   cpuCard.ejs
│   │   cpuCoolerCard.ejs
│   │   FAQ.ejs
│   │   form_group.ejs
│   │   gpuCard.ejs
│   │   iconbar.ejs
│   │   loadingpage.ejs
│   │   memoryCard.ejs
│   │   menu_buttons.ejs
│   │   motherboardCard.ejs
│   │   navbar.ejs
│   │   nextComponentPage.ejs
│   │   nextFilteredComponentPage.ejs
│   │   partsSearch.ejs
│   │   part_card.ejs
│   │   popUpNotification.ejs
│   │   powerSupplyCard.ejs
│   │   prebuiltForms.ejs
│   │   prebuiltOption.ejs
│   │   previousComponentPage.ejs
│   │   previousFilteredComponentPage.ejs
│   │   storageCard.ejs
│   │   UsesCheckbox.ejs
│   │   UsesRadiobox.ejs
│   │
│   └───filteringOptions
│           cpuCoolerFilter.ejs
│           cpuFilter.ejs
│           gpuFilter.ejs
│           memoryFilter.ejs
│           motherboardFilter.ejs
│           powersupplyFilter.ejs
│           storageFilter.ejs
│
└───templates
        demoteForm.ejs
        notification_page.ejs
        promoteForm.ejs
        skeleton_template.ejs
</pre>
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
