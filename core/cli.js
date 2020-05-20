import arg from 'arg';
import inquirer from 'inquirer';
import {createProject} from './generate';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
    {
        '--git': Boolean,
        '--install': Boolean,
        '-g': '--git',
        '-i': '--install',
    },
    {
        argv: rawArgs.slice(2),
    }
    );
    //console.log(args);
    return {
        git: args['--git'] || false,
        projectName: args._[0],
        runInstall: args['--install'] || false,
    };
}

async function promptForMissingOptions(options) {
    const questions = [];
    if (!options.projectName) {
        questions.push({
            type: 'input',
            name: 'projectName',
            message: 'Please Enter The Project Name'
        });
    }
   
    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: 'Initialize a git repository?',
            default: false,
        });
    }

    if (!options.runInstall) {
        questions.push({
            type: 'confirm',
            name: 'runInstall',
            message: 'Install the project dependency?',
            default: false,
        });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      projectName: options.projectName || answers.projectName,
      git: options.git || answers.git,
      runInstall: options.runInstall || answers.runInstall
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    //console.log(options);
    await createProject(options);
}