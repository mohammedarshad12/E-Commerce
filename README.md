AWS Add-to-Cart Project
Project Overview:
This project is an Add-to-Cart feature for an e-commerce platform, built using AWS services.
It enables users to add products to their cart, store cart details securely in Amazon DynamoDB, and retrieve them later through serverless APIs.

Features:
 Users can add products to their cart
 Cart data is stored securely in AWS DynamoDB
 API Gateway routes requests to AWS Lambda functions
 AWS S3 hosts the frontend web application
 AWS IAM roles manage secure access to AWS resources

 Technologies Used:
 AWS Lambda – Backend logic processing
 Amazon API Gateway – Handling API requests
 Amazon DynamoDB – Storing cart details
 Amazon S3 – Frontend hosting
 AWS IAM – Security and access management

 Architecture:
 User interacts with the frontend hosted on Amazon S3
 API requests are sent via Amazon API Gateway
 AWS Lambda functions process Add-to-Cart requests
 Cart details are stored in Amazon DynamoDB
 Responses are returned to the frontend

 Deploy Backend (Lambda, API Gateway, DynamoDB):
 Create a DynamoDB table named CartTable with userId as the partition key.
 Deploy Lambda functions to handle Add-to-Cart and Retrieve actions.
 Configure API Gateway to invoke Lambda functions.
 Grant necessary permissions using IAM roles.

 Deploy Frontend (S3 & CloudFront):
 Upload your frontend files (HTML, CSS, JS) to an S3 bucket.
 Enable static website hosting for the bucket.
