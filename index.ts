import {setResult, TaskResult} from 'azure-pipelines-task-lib/task';
import { getParams, validateParams, setFailedResults, deploy } from './util';

async function run() {
    try {
        const params = getParams();

        console.log(`params parsed: ${JSON.stringify(params)}`);

        var validationResult = await validateParams(params);
        if(validationResult !== null)
        {
            setFailedResults(validationResult);
            return;
        }

        await deploy(params);

        setResult(TaskResult.Succeeded, 'Deployment succeeded.');
    }
    catch (err) {
        // @ts-ignore
        setResult(TaskResult.Failed, err.message);
    }
}

run();
