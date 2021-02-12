import {DynamoDB} from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();


type AppSyncEvent = {
    info: {
        fieldName: String
    },
    arguments : {
        product: Product
        productId: String
    }
}

type Product = {
    id: String
    name: String
    price: Number
}

exports.handler = async (event:AppSyncEvent ) => {
    if(event.info.fieldName=="welcome"){
        return "hello world"
    }
    else if(event.info.fieldName=="addProduct"){
        event.arguments.product.id = 'Key-'+Math.random();
        const params = {
            TableName: process.env.TABLE_NAME || '',
            Item: event.arguments.product
        }

        const data = await documentClient.put(params).promise();

        console.log('after adding data', data);
        return event.arguments.product;
    }

    else if(event.info.fieldName=="deleteProduct"){
        // event.arguments.product.id = 'Key-'+Math.random();
        const params = {
            TableName: process.env.TABLE_NAME || '',
            Key: {
                id: event.arguments.productId
            }
        }

        const data = await documentClient.delete(params).promise();

        console.log('after Delete data', data);
        return "Deleted";
    }

    else{
        return "Not Found"
    }
}