import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodoAttachmentUrl } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils'

const logger = createLogger('get Todo Attachment Url')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Starting get todo attachment URL: ', event);
    const todoId = event.pathParameters.todoId;
    const userId: string = getUserId(event);
    const TodoAttachmentUrl = await getTodoAttachmentUrl(userId, todoId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        TodoAttachmentUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(cors(
    {
      origin: "*",
      credentials: true,
    }
  ))
