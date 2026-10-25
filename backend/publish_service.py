import time
import boto3
import json
import os
from botocore.exceptions import ClientError

# .env la irundhu variables ah edukrom
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")
SQS_QUEUE_URL = os.getenv("SQS_QUEUE_URL")

# Boto3 client setup
sqs = boto3.client(
    'sqs',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

def trigger_publish(website_id, user_id, username, template_name, html_content):
    """
    Ithu SQS queue ku message anuppum.
    Lambda function ithu receive panni S3 la upload pannum.
    """
    payload = {
        "website_id": website_id,
        "user_id": user_id,
        "username": username,
        "template_name": template_name,
        "html_content": html_content, # User oda final HTML string
        "action": "publish_site"
    }

    try:
        response = sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            MessageBody=json.dumps(payload)
        )
        print(f"✅ SQS Message Sent! Message ID: {response.get('MessageId')}")
        return {"success": True, "message_id": response.get('MessageId')}
    
    except ClientError as e:
        print(f"❌ SQS Error: {e}")
        return {"success": False, "error": str(e)}
        # ✅ CloudFront Auto-Invalidate
    try:
        cf = boto3.client('cloudfront', region_name='us-east-1')
        cf.create_invalidation(
            DistributionId='E1HOJ6B5DZ4I34', # Unga CloudFront ID
            InvalidationBatch={
                'Paths': {'Quantity': 1, 'Items': [f'/{username}/*']},
                'CallerReference': str(time.time())
            }
        )
        print(f"✅ CloudFront Invalidated for /{username}/*")
    except Exception as e:
        print(f"⚠️ CloudFront Invalidation failed: {e}")
