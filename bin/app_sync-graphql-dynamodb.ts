#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppSyncGraphqlDynamodbStack } from '../lib/app_sync-graphql-dynamodb-stack';

const app = new cdk.App();
new AppSyncGraphqlDynamodbStack(app, 'AppSyncGraphqlDynamodbStack');
