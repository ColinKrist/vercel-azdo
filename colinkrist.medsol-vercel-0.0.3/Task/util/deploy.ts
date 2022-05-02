import { setResult, setVariable, TaskResult } from 'azure-pipelines-task-lib'
import { TaskParams } from '../models/TaskParams';
import { createDeployment, Deployment, DeploymentError } from '@vercel/client';

export async function deploy(params: TaskParams) {
    let deployment;

    for await (const event of createDeployment({
        ...params,
    })) {
        if (event.type != 'hashes-calculated'){
            console.log(`[Vercel] - ${event.type} - ${JSON.stringify(event.payload)}`);
        }


        // handle deployment events
        switch(event.type){
            case 'created':
            case 'ready': {
                const payload: Deployment = event.payload;
                console.log(`Deployment: ${event.type} -> ${payload.url} | setting shared variable 'deploymentUrl'`);
                setVariable('deploymentUrl', payload.url);
                break;
            }
            case 'error': {
                const payload: DeploymentError = event.payload;
                const message = `Vercel Error: ${payload.name} | ${payload.message} - code: ${payload.code}`;
                console.error(message);
                setResult(TaskResult.Failed, message);
            }
            break;
        }
    }

    return deployment;
}
