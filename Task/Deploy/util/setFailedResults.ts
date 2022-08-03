const { setResult, TaskResult } = require("azure-pipelines-task-lib");
import { ValidationError } from "yup";

export function setFailedResults(paramValidationResult: ValidationError) {
  if (paramValidationResult.errors.length > 0) {
    paramValidationResult.errors.forEach((errorMessage) => {
      console.error(errorMessage);
      setResult(TaskResult.Failed, errorMessage);
    });
  }
}
