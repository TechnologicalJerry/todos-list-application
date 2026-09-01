import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: "List user's todos" })
  @ApiResponse({ status: 200, description: 'List of todos' })
  async findAll(@GetUser('_id') userId: string, @Query() query: QueryTodoDto) {
    return this.todosService.findAll(userId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a todo' })
  @ApiResponse({ status: 201, description: 'Todo created successfully' })
  async create(@GetUser('_id') userId: string, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(userId, createTodoDto);
  }

  @Get(':todoId')
  @ApiOperation({ summary: 'Get a todo' })
  @ApiResponse({ status: 200, description: 'Todo details' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async findOne(@GetUser('_id') userId: string, @Param('todoId') todoId: string) {
    return this.todosService.findOne(userId, todoId);
  }

  @Put(':todoId')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 200, description: 'Todo updated successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async update(
    @GetUser('_id') userId: string,
    @Param('todoId') todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(userId, todoId, updateTodoDto);
  }

  @Delete(':todoId')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({ status: 200, description: 'Todo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  async remove(@GetUser('_id') userId: string, @Param('todoId') todoId: string) {
    return this.todosService.remove(userId, todoId);
  }
}
