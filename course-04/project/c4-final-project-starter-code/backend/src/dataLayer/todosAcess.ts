import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly attachmentBucket = process.env.ATTACHMENT_S3_BUCKET) {
  }

  async getTodosForUser(userId: string): Promise<TodoItem[]> {

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      },
      
    }).promise()
    const items = result.Items

    return items as TodoItem[]
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem> {
    const result = await this.docClient.get({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
    }).promise();

    return result.Item as TodoItem;
  }

  async getTodoAttachmentUrl(userId: string, todoId: string): Promise<string> {
    const result =await this.getTodo(userId, todoId)
    return result.attachmentUrl;
  }

  async createTodoItem(todo: TodoItem): Promise<TodoItem> {
    console.log('Creating a todo with id ${todo.todoId}')
    
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async deleteTodoItem(userId: string, todoId: string): Promise<void> {
    console.log('Delete a todo with id ${todo.todoId}')
    
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: { userId, todoId }
    }).promise()

    return;
  }

  async updateTodoItem(userId: string, todoId: string, todo: UpdateTodoRequest): Promise<void> {
    logger.info('update Todo Item: ', todo);
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set #name = :updateName, #done = :doneStatus, #dueDate = :updateDueDate',
      ExpressionAttributeNames: { 
        '#name': 'name',
        '#done': 'done',
        '#dueDate': 'dueDate' },
      ExpressionAttributeValues: {
        ':updateName': todo.name,
        ':doneStatus': todo.done,
        ':updateDueDate': todo.dueDate,
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();

    return;
  }  

  async updateTodoAttachment(userId: string, todoId: string): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: { '#attachmentUrl': 'attachmentUrl' },
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${this.attachmentBucket}.s3.amazonaws.com/${todoId}`
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }

}


function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient()
}
