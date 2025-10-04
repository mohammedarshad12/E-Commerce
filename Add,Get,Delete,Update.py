import json
import boto3
from decimal import Decimal

# DynamoDB setup
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("CartTable")

# Helper to convert Decimal to float for JSON serialization
def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, list):
        return [decimal_to_float(i) for i in obj]
    if isinstance(obj, dict):
        return {k: decimal_to_float(v) for k, v in obj.items()}
    return obj

def lambda_handler(event, context):
    try:
        method = event.get("httpMethod", "")
        print("Received Event:", event)

        # ✅ POST -> Add a new item to the cart
        if method == "POST":
            body = json.loads(event["body"])
            cartID = str(body["cartID"])
            productName = body["productName"]
            price = int(body["price"])
            quantity = int(body["quantity"])

            table.put_item(
                Item={
                    "cartID": cartID,
                    "productName": productName,
                    "price": price,
                    "quantity": quantity,
                }
            )

            return {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"message": "Item added to cart"}),
            }

        # ✅ GET -> Fetch all items from the cart
        elif method == "GET":
            response = table.scan()
            items = response.get("Items", [])
            items = decimal_to_float(items)  # Fix Decimal issue

            return {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"items": items}),
            }

        # ✅ DELETE -> Remove an item from the cart
        elif method == "DELETE":
            body = json.loads(event["body"])
            cartID = body["cartID"]

            table.delete_item(Key={"cartID": cartID})

            return {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"message": "Item removed from cart"}),
            }

        # ✅ PUT -> Update the quantity of an existing item
        elif method == "PUT":
            body = json.loads(event["body"])
            cartID = body["cartID"]
            new_quantity = int(body["quantity"])

            table.update_item(
                Key={"cartID": cartID},
                UpdateExpression="set quantity = :q",
                ExpressionAttributeValues={":q": new_quantity},
                ReturnValues="UPDATED_NEW",
            )

            return {
                "statusCode": 200,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"message": "Quantity updated successfully"}),
            }

        # ❌ Unsupported HTTP method
        else:
            return {
                "statusCode": 400,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": f"Unsupported method: {method}"}),
            }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)}),
        }
