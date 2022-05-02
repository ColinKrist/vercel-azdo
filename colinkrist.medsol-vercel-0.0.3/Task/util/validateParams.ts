import { ValidationError } from 'yup';
import { object, string } from 'yup';
import * as yup from 'yup';
import { TaskParams } from '../models/TaskParams';

// @ts-ignore
let schema = object<Partial<TaskParams>>({
    token: yup.string().required("Vercel Token is required"),
    path: yup.string().required("Path is required")
})

export async function validateParams(params: TaskParams): Promise<ValidationError | null> {
    try {
        await schema.validate(params);
        return null;
    } catch (error) {
        const typedError = error as ValidationError;

        return typedError;
    }
}
