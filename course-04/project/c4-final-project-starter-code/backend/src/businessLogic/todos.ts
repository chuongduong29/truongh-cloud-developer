import { TodoAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
// import { parseUserId } from '../auth/utils'

// const logger = createLogger('Todos')
const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return todoAccess.getTodosForUser(userId);
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4()

  return await todoAccess.createTodoItem({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function deleteTodo(userId: string, todoId: string): Promise<void> {
    return todoAccess.deleteTodoItem(userId, todoId);
}

export async function updateTodo(userId: string, todoId: string, payload: UpdateTodoRequest) : Promise<void>{
    return todoAccess.updateTodoItem(userId, todoId, payload);
  }

  export async function updateTodoAttachment(userId: string, todoId: string): Promise<void> {
    return todoAccess.updateTodoAttachment(userId, todoId);
  }

  export async function getTodoAttachmentUrl(userId: string, todoId: string): Promise<string> {
    return todoAccess.getTodoAttachmentUrl(userId, todoId);
  }
