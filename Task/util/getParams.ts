import { getInput } from 'azure-pipelines-task-lib/task';
import { TaskParams } from '../models/TaskParams';

export function getParams(): TaskParams {
    const params: TaskParams = {
        token: '',
        path: ''
    };

    params.token = getInput('token', true) ?? '';
    params.path = getInput('path', true) ?? '';

    params.apiUrl = getInput('apiUrl', false);
    params.debug = getInput('debug', false) === 'true';
    params.force = getInput('force', false) === 'true';
    params.isDirectory = getInput('isDirectory', false) === 'true';
    params.prebuilt = getInput('prebuilt', false) === 'true';
    params.rootDirectory = getInput('rootDirectory', false);
    params.skipAutoDetectionConfirmation = getInput('skipAutoDetectionConfirmation', false) === 'true';
    params.teamId = getInput('teamId', false);
    params.userAgent = getInput('userAgent', false);
    params.withCache = getInput('withCache', false) === 'true';

    return params;
}
