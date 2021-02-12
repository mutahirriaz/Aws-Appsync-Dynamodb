import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as appsync from '@aws-cdk/aws-appsync';
import * as dynamodb from '@aws-cdk/aws-dynamodb'


export class AppSyncGraphqlDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new appsync.GraphqlApi(this, 'MyDBApi', {
      name: 'cdk-appsync-dynamodb-api',
      schema: appsync.Schema.fromAsset('schema/graphql.gql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          
        },
      },
      xrayEnabled: true,
    });

    const lambda_function = new lambda.Function(this, 'DynamoDbLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: "index.handler"
    });

    const lambda_datasource = api.addLambdaDataSource("LambdaDatabase", lambda_function);

    lambda_datasource.createResolver({
      typeName: "Query",
      fieldName: "welcome"
    })

    lambda_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "addProduct"
    })

    lambda_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteProduct"
    })

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
     });
 
     // Prints out the AppSync GraphQL API key to the terminal
     new cdk.CfnOutput(this, "GraphQLAPIKey", {
       value: api.apiKey || ''
     });

     const productTable = new dynamodb.Table(this, 'CDKNotesTable', {
       tableName: 'Products',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });
    // enable the Lambda function to access the DynamoDB table (using IAM)
    productTable.grantFullAccess(lambda_function)

    lambda_function.addEnvironment('TABLE_NAME', productTable.tableName)
    

  }
}
