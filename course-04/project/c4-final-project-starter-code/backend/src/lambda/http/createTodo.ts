import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

    const newTodoName = newTodo.name
    if (!newTodoName.split(' ').join('')) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'ERROR: Todo name is empty.'
        })
      };
    }

    const userId: string = getUserId(event);
    const newItem = await createTodo(newTodo, userId)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
