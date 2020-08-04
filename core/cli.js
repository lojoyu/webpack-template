import arg from 'arg';
import inquirer from 'inquirer';
import {createProject} from './generate';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
    {
        '--git': Boolean,
        '--install': Boolean,
        '--type': String,
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
        type: args['--type']
    };
}

async function promptForMissingOptions(options) {
    const questions = [];
    console.log(options);
    if (!options.projectName) {
        questions.push({
            type: 'input',
            name: 'projectName',
            message: 'Please Enter The Project Name'
        });
    }

    if (!options.type) {
        questions.push({
            type: 'list',
            name: 'type',
            message: 'Which type of project do you want to create?',
            choices: ['website', 'npm_package']
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
      type: options.type || answers.type,
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