import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository,
    ) {}
       
   
    
     getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return  this.taskRepository.getAllTasks(filterDto);
    }
    

    async getTaskById(id: string) : Promise<Task>{
        const found = await this.taskRepository.findOne(id);
        
        if(!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }

        return found
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto)
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> { 

        const task = await this.getTaskById(id);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }
    
   
    deleteTask(id: string): Promise<void>    {
        return this.taskRepository.deleteTask(id)
    }
    
}
