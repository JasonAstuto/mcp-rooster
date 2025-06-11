import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as logs from 'aws-cdk-lib/aws-logs';

export class McpRoosterApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 🚪 Public frontend bucket
    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      versioned: true,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // 📦 Log storage bucket
    const logsBucket = new s3.Bucket(this, 'LogsBucket', {
      versioned: true,
      autoDeleteObjects: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // 🔐 Secret placeholder for OpenAI key
    const openAiSecret = new secretsmanager.Secret(this, 'OpenAISecret', {
      secretName: 'McpRoosterOpenAIKey',
      description: 'OpenAI API Key placeholder for MCP Rooster',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ key: 'replace-me' }),
        generateStringKey: 'dummy',
      },
    });

    // 🏗️ VPC + ECS cluster
    const vpc = new ec2.Vpc(this, 'RoosterVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'RoosterCluster', { vpc });

    // 📦 Fargate Task
    const taskDef = new ecs.FargateTaskDefinition(this, 'RoosterTask');
    taskDef.addContainer('RoosterContainer', {
      image: ecs.ContainerImage.fromAsset('../src/backend/McpRooster.API'),
      memoryLimitMiB: 512,
      cpu: 256,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'McpRooster',
        logRetention: logs.RetentionDays.ONE_WEEK,
      }),
      environment: {
        ASPNETCORE_ENVIRONMENT: 'Production',
        LOG_BUCKET: logsBucket.bucketName,
        OPENAI_SECRET_NAME: openAiSecret.secretName,
      },
    });

    // 🚀 Load-balanced Fargate service
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'RoosterService', {
      cluster,
      taskDefinition: taskDef,
      publicLoadBalancer: true,
    });

    // 📤 Outputs
    new CfnOutput(this, 'FrontendBucketURL', {
      value: frontendBucket.bucketWebsiteUrl,
      description: 'S3 bucket hosting the frontend',
    });

    new CfnOutput(this, 'LogsBucketName', {
      value: logsBucket.bucketName,
    });

    new CfnOutput(this, 'OpenAISecretName', {
      value: openAiSecret.secretName,
    });
  }
}
