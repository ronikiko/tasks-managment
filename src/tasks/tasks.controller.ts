import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { StatusValidationDto } from './dto/status-chek.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) { }
    
    @Get()
    getAllTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.taskService.getAllTasks(filterDto);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> { 
        return this.taskService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Promise<Task> {
        return this.taskService.getTaskById(id);
    }


    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): Promise<void> {
        return this.taskService.deleteTask(id);
    }

    
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() statusValidationDto: StatusValidationDto): Promise<Task> {
        
        const { status } = statusValidationDto;

        return this.taskService.updateTaskStatus(id, status);
    }
}
