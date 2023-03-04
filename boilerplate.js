const { exec } = require('node:child_process');
const { CONTROLLER, SERVICE, REPOSITORY, MODEL, SCHEMA } = require('./template');
const fs = require('fs');
const args = process.argv.slice(2);
const moduleName = args[1].toLowerCase();
let modelName = '';
const moduleSplit = moduleName.split('-');
moduleSplit.forEach(str => {
    modelName += str[0].toUpperCase() + str.slice(1);
});
// modelName = moduleName[0].toUpperCase() + moduleName.slice(1);
// if (moduleName.includes('-')) {
// }
const controllerName = modelName + 'Controller';
const serviceName = modelName + 'Service';
const repositoryName = modelName + 'Repository';
const commands = [];

// create module resources
if (args[0] === 'make:module') {
    // commands.push(`cd ${__dirname}/src/resources`); // cd into resources
    // commands.push(`mkdir ${moduleName}`); // create directory
    const moduleDir = __dirname + '/src/resources/' + moduleName;
    if (!fs.existsSync(moduleDir)){
        fs.mkdirSync(moduleDir);
        console.log(moduleDir + " directory created");
    }
    
    // create controller
    const controllerContent = CONTROLLER.replace(/{CONTROLLER_NAME}/g, controllerName)
        .replace(/{MODEL_NAME}/g, modelName).replace(/{MODULE_NAME}/g, moduleName)
        .replace(/{SERVICE_NAME}/g, serviceName);
    
    fs.writeFile(`${moduleDir}/${moduleName}.controller.ts`, controllerContent, function (err) {
        if (err) throw err;
        console.log(`${moduleName}.controller.ts`);
    })
    // commands.push(`printf "${controllerContent}" > ${moduleName + '/' + moduleName}.controller.ts`);
    
    // create service
    const serviceContent = SERVICE.replace(/{MODULE_NAME}/g, moduleName)
        .replace(/{MODEL_NAME}/g, modelName).replace(/{SERVICE_NAME}/g, serviceName)
        .replace(/{REPOSITORY_NAME}/g, repositoryName);

    fs.writeFile(`${moduleDir}/${moduleName}.service.ts`, serviceContent, function (err) {
        if (err) throw err;
        console.log(`${moduleName}.service.ts`);
    })
    // commands.push(`printf '${serviceContent}' > ${moduleName + '/' + moduleName}.service.ts`);
    
    // create repository
    const repositoryContent = REPOSITORY.replace(/{MODULE_NAME}/g, moduleName)
        .replace(/{REPOSITORY_NAME}/g, repositoryName).replace(/{MODEL_NAME}/g, modelName);
        
    fs.writeFile(`${moduleDir}/${moduleName}.repository.ts`, repositoryContent, function (err) {
        if (err) throw err;
        console.log(`${moduleName}.repository.ts`);
    })
    // commands.push(`printf '${repositoryContent}' > ${moduleName + '/' + moduleName}.repository.ts`);

    // create model
    // commands.push(`cd ${__dirname}/src/models`); // cd into model
    const modelContent = MODEL.replace(/{MODEL_NAME}/g, modelName);
    fs.writeFile(`${__dirname}/src/models/${moduleName}.model.ts`, modelContent, function (err) {
        if (err) throw err;
        console.log(`${moduleName}.model.ts`);
    })
    // commands.push(`printf '${modelContent}' > ${moduleName}.model.ts`);

    // create schema
    fs.writeFile(`${__dirname}/src/schemas/${moduleName}.schema.ts`, SCHEMA, function (err) {
        if (err) throw err;
        console.log(`${moduleName}.schema.ts`);
    })
    // commands.push(`cd ${__dirname}/src/schemas`); // cd into model
    // commands.push(`printf '${SCHEMA}' > ${moduleName}.schema.ts`);

    // exec(commands.join(' && '), (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error: ${error}`);
    //         return;
    //     }
        
    //     if (stdout) console.log(`stdout: ${stdout}`); 
    //     if (stderr) console.error(`stderr: ${stderr}`);
    // });
}

