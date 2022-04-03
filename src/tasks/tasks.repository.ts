import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  // get all tasks
  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }

  // Create task
  async createTask(createTaskDto: CreateTaskDto, user): Promise<Task> {
    const { title, description } = createTaskDto;

    const newUser = {
      username: user.username,
      status: user.status,
      tasks: user.tasks,
    };
    const task = this.create({
      title,
      description,
      // setting default status to open
      status: TaskStatus.OPEN,
      user,
    });
    // save to database
    await this.save(task);
    return task;
  }

  // delete task
  async deleteTask(id: string, user: User): Promise<void> {
    const task = await this.delete({ id, user });
    if (task.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
