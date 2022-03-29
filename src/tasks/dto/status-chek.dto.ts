import { IsEnum } from "class-validator";
import { TaskStatus } from "../task.status.enum";


export class StatusValidationDto {
    @IsEnum(TaskStatus)
    status: TaskStatus;
}