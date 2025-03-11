#!/bin/bash

# Set AWS variables
AWS_REGION="us-east-1"   # Change to your region
INSTANCE_TYPE="t2.micro"
AMI_ID="ami-0c55b159cbfafe1f0"  # Amazon Linux 2 AMI (find one for your region)
KEY_NAME="NotesAppKey"   # Change to your AWS key pair name
SECURITY_GROUP="sg-015895cddcc330457"  # Replace with your security group ID
INSTANCE_NAME="NotesAppInstance"
GIT_REPO="https://github.com/ManojM-656565/Notes_App.git"

# Check if EC2 instance already exists
INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=$INSTANCE_NAME" --query "Reservations[*].Instances[*].InstanceId" --output text)

if [ -z "$INSTANCE_ID" ]; then
    echo "No existing EC2 instance found. Creating a new one..."

    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id $AMI_ID \
        --instance-type $INSTANCE_TYPE \
        --key-name $KEY_NAME \
        --security-group-ids $SECURITY_GROUP \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$INSTANCE_NAME}]" \
        --query "Instances[0].InstanceId" --output text)

    echo "Waiting for EC2 instance to initialize..."
    sleep 30  # Wait for the instance to be available
fi

# Get EC2 Public IP
EC2_PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[*].Instances[*].PublicIpAddress" --output text)

echo "EC2 instance is running at: $EC2_PUBLIC_IP"

# Connect to EC2 & Deploy the app
ssh -o StrictHostKeyChecking=no -i $KEY_NAME.pem ubuntu@$EC2_PUBLIC_IP << EOF

# Update system and install dependencies
sudo apt update -y && sudo apt install -y docker docker-compose git

# Clone the repository (if not already cloned)
if [ ! -d "NotesApp" ]; then
    git clone $GIT_REPO NotesApp
fi

cd NotesApp

# Pull the latest code
git pull origin main

# Update backend URL in frontend/.env
echo "VITE_BACKEND_URL=http://$EC2_PUBLIC_IP:5000" > frontend/.env

# Build and start the app using Docker Compose
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d

EOF

echo "Deployment successful! Access your app at: http://$EC2_PUBLIC_IP"
