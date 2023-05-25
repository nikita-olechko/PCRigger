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

## Installation / Setup

### Setup the project requirements
1. Install VSCode
2. Install Node <https://nodejs.org/en/download>

### Install node modules
1. Launch the project in VSCode
2. Open the integrated terminal (Crtl + `)
3. Type "npm install" in the terminal and press enter to install all packages required for use of this repo
4. (Optional but recommended) Install nodemon. Type "npm install --global nodemon" in the integrated termanl and presa enter

### Configure Environment Variables
1. If you are an approved contributor a .env file will be sent to you via Email that will contain all the required environment variables
2. Add your .env file to the root folder of the project
3. Ensure your .env file is named specifically ".env"
4. Should issues with DB connection occur, contact Nikita Olechko at nikita.olechko@gmail.com 

### Start the app locally to ensure all is working
1. Open the VSCode integrated terminal from the root of the project
2. Type "nodemon index.js" and press enter
3. You are now ready to work on PCRigger

---

## Use PCRiggers Features and How to Use Them

### PC Build Generation

### PC Build Saving / Editing

### PC Component Comparison
1. From the members page, navigate to 'Compare Parts' page.
2. Select a part category from the list presented.
3. Scroll and discover parts that are available in our DB.
4. Choose two parts by clicking the checkbox on the part's card.
5. Once two parts have been selected, the compare button is now enabled, click it and wait for AI to do its magic.
### AI PC Build Descriptions
1. From anywhere in the app, go to the navbar options to access 'Profile' page.
2. Choose one of your saved builds.
3. Scroll down and click 'Build Info' then wait for AI to generate a description, it will then be saved to your build for later use.
### PC Component Info Pages + General Build Guides

---

## Credits, References, and More

### Contributors
Thank you to all who have contributed to the creation, ideation, data sourcing, refactoring, project organization and more to make PCRigger happen.

[@nikita-olechko](https://github.com/nikita-olechko), [@Abdo-Abuharrus211](https://github.com/Abdo-Abuharrus211), [@CPostnikoff](https://github.com/CPostnikoff),
[@brianctb](https://github.com/brianctb)

### References

The following references were heavily utilized during the creation of this repo.

<https://chat.openai.com/> by [OpenAI](https://openai.com/) for code generation, commenting, ideation and more
<https://www.mongodb.com/docs/> for MongoDB

### Third-Party Dependencies

node modules
- axios: 1.4.0
- bcrypt:  5.1.0
- bootstrap: 5.2.3
- connect-flash: 0.1.1
- connect-mongo: 4.6.0
- dotenv: 16.0.3
- ejs: 3.1.9
- express: 4.18.2
- express-session: 1.17.3
- flash: 1.1.0
- joi: 17.8.4
- mongoose: 7.1.1
- pug: 3.0.2
---

## How Was AI Leveraged?

### OpenAI api

OpenAI's api using gpt-3.5-turbo is used to generate PC-builds for a user's selected filtering preferences. Each part is then passed to a query to see if it exists in the respective component database. If the part is present, it will populate as normal in the configurator screen. If the part does not exist within our database, gpt-3.5 will generate an object for the specific part is then added to the component database database.

### Various logo generating tools

We utilized a number of AI logo generators to come up with drafts of potential logos.
Including logo.com , Designs.ai , & Shopify's logo generator.
### Code and Documentation Generation

<https://chat.openai.com/> and <https://www.forefront.ai/> were leveraged to generate functions and comments which were then refined for use within PCRigger.

### Ideation and Feature Selection

<https://chat.openai.com/> was used to determine what features/attributes were important and necessary for development of PCRigger. Prompts such as:
- "When building a new computer, what aspects of a grapics card are important to consider for the following use cases: gaming, workstation, general use, home computing"
- "You are a developer creating a MongoDB database collection that will store each component (Build name, Case, CPU, GPU, Motherboard, Memory, Storage, Powersupply) of that computer. What would the MongoDB schema look like? Keep in mind that multiple memory modules or multiple storage devices can be used"

The outputs of each prompt were then refined for use within PCRigger.

### Automatic Database Growth

When a new build is generated for a user by OpenAI's gpt-3.5-turbo api, it is populated into the configurator. Then, each part of the generated build is checked to see if a part with the same name exists within the database. If it does not, the gpt-3.5-turbo api is then used to generate a new object for insertion into the database with all necessary fields and details.

---

## Contact Information
### Abdulqadir Abuharrus
Email: aabuharrus@gmail.com
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
