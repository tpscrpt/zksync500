import path from "path";
import * as CDK from "@aws-cdk/core";
import * as ApiGateway from "@aws-cdk/aws-apigateway";
import * as Lambda from "@aws-cdk/aws-lambda";
import * as DynamoDB from "@aws-cdk/aws-dynamodb";
import { tables } from "../config/tables";
import { deploySalt } from "../config/deploy-salt";

export class ShortStack extends CDK.Stack {
  constructor(app: CDK.App, id: string) {
    super(app, id);

    const shortGateway = new ApiGateway.RestApi(this, "ShortApi", {});

    const shortLambda = new Lambda.Function(this, "ShortLambda", {
      code: new Lambda.AssetCode(path.join(__dirname, "../../.build/short")),
      handler: "index.handler",
      runtime: Lambda.Runtime.NODEJS_12_X,
    });

    const convertLambda = new Lambda.Function(this, "ConvertLambda", {
      code: new Lambda.AssetCode(path.join(__dirname, "../../.build/convert")),
      handler: "index.handler",
      runtime: Lambda.Runtime.NODEJS_12_X,
    });

    const shortResource = shortGateway.root.addResource("short");
    const shortIntegration = new ApiGateway.LambdaIntegration(shortLambda);
    shortResource.addMethod("POST", shortIntegration);

    const convertResource = shortGateway.root.addResource("{short}");
    const convertIntegration = new ApiGateway.LambdaIntegration(convertLambda);
    convertResource.addMethod("GET", convertIntegration);

    const shortTable = new DynamoDB.Table(this, "ShortTable", {
      tableName: tables.ShortTable.TableName,
      billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "short",
        type: DynamoDB.AttributeType.STRING,
      },
    });

    shortTable.grantReadData(convertLambda);
    shortTable.grantWriteData(shortLambda);
  }
}

const app = new CDK.App();
new ShortStack(app, "ShortStack" + deploySalt);
app.synth();
